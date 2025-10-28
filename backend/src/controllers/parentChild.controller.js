import { client } from "../lib/db.js";

export async function createParentChild(req, res) {
  const member_id = req.params.id;
  const child_id = req.body.children[0];
  
  const genderResult = await client.query(
    "SELECT gender FROM members Where member_id = ($1)",
    [member_id]
  );

  if (genderResult.rows.length === 0) {
    return res.status(404).json({ error: "Member not found" });
  }

  const childExist = await client.query(
    "SELECT * FROM parent_child WHERE child_id = ($1)",
    [child_id]
  );

  if (childExist.rows.length > 0) {
    return res.status(404).json({ error: "Child have parents Already" });
  }

  const memberGender = genderResult.rows[0].gender;
  let marriageCheck, couple_id;

  if (memberGender === true) {
    marriageCheck = "SELECT couple_id FROM couples WHERE husband_id = $1;";
  } else {
    marriageCheck = "SELECT couple_id FROM couples WHERE wife_id = $1;";
  }

  async function checkParentChildCombination(couple_id, child_id) {
    const query = `
    SELECT EXISTS (
      SELECT 1 FROM parent_child
      WHERE couple_id = $1 AND child_id = $2
    ) AS exists;
  `;
    const result = await client.query(query, [couple_id, child_id]);

    // result.rows[0].exists will be true or false
    return result.rows[0].exists;
  }

  const marriageResult = await client.query(marriageCheck, [member_id]);

  if (marriageResult.rows[0].couple_id === null) {
    return res.status(404).json({ error: "Couples not found" });
  }

  couple_id = marriageResult.rows[0].couple_id;
  try {
    checkParentChildCombination(couple_id, child_id).then(async (exists) => {
      if (exists) {
        return res.status(400).json({ message: "Combination already exists!" });
      }
      const result = await client.query(
        "INSERT INTO parent_child (couple_id , child_id) VALUES ($1,$2)",
        [couple_id, child_id]
      );
      return res.status(201).json({ success: true, data: result.rows[0] });
    });
  } catch (error) {
    console.log("Error in Parents Child Creation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getParentChild(req, res) {
  const member_id = req.params.id;

  const genderResult = await client.query(
    "SELECT gender FROM members Where member_id = ($1)",
    [member_id]
  );

  if (genderResult.rows.length === 0) {
    return res.status(404).json({ error: "Member not found" });
  }

  const memberGender = genderResult.rows[0].gender;

  let marriageCheck;

  if (memberGender === true) {
    marriageCheck = "SELECT couple_id FROM couples WHERE husband_id = $1;";
  } else {
    marriageCheck = "SELECT couple_id FROM couples WHERE wife_id = $1;";
  }
  try {
    const marriageResult = await client.query(marriageCheck, [member_id]);

    if (marriageResult.rows[0].couple_id === null) {
      return res.status(404).json({ error: "Not Married" });
    }

    const couple_id = marriageResult.rows[0].couple_id;

    const result = await client.query(
      "SELECT m.name AS child_name FROM parent_child c JOIN  members m ON c.child_id = m.member_id WHERE c.couple_id = ($1)",
      [couple_id]
    );
    return res.status(201).json({ success: true, data: result.rows });
  } catch (error) {
    console.log("Error in Finding Children", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllChildren(req, res) {
  const family_id = req.params.id;

  try {
    const result = await client.query(
      "SELECT ch.* FROM parent_child ch JOIN members m ON ch.child_id = m.member_id JOIN family_members f ON m.member_id = f.member_id WHERE f.family_id =($1)",
      [family_id]
    );

    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.log("Error in Fetching all children", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteParentChild(req, res) {
  const member_id = req.params.id;
  const child_id = req.body.member_id;
  const genderResult = await client.query(
    "SELECT gender FROM members Where member_id = ($1)",
    [member_id]
  );

  if (genderResult.rows.length === 0) {
    return res.status(404).json({ error: "Member not found" });
  }

  const memberGender = genderResult.rows[0].gender;

  let marriageCheck;

  if (memberGender === true) {
    marriageCheck = "SELECT couple_id FROM couples WHERE husband_id = $1;";
  } else {
    marriageCheck = "SELECT couple_id FROM couples WHERE wife_id = $1;";
  }

  const marriageResult = await client.query(marriageCheck, [member_id]);

  if (marriageResult.rows[0].couple_id === null) {
    return res.status(404).json({ error: "Couples not found" });
  }

  async function checkParentChildCombination(couple_id, child_id) {
    const query = `
    SELECT EXISTS (
      SELECT 1 FROM parent_child
      WHERE couple_id = $1 AND child_id = $2
    ) AS exists;
  `;
    const result = await client.query(query, [couple_id, child_id]);

    // result.rows[0].exists will be true or false
    return result.rows[0].exists;
  }

  const couple_id = marriageResult.rows[0].couple_id;
  try {
    checkParentChildCombination(couple_id, child_id).then(async (exists) => {
      if (!exists) {
        return res.status(400).json({ message: "Combination Not exists!" });
      }
      await client.query(
        "DELETE FROM parent_child WHERE couple_id =($1) AND child_id = ($2)",
        [couple_id, child_id]
      );
      return res.status(201).json({ success: true });
    });
  } catch (error) {
    console.log("Error in Deleting  Parent Child", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
