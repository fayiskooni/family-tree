import { client } from "../lib/db.js";

export async function createParentChild(req, res) {
  const member_id = req.params.id;
  const childrenIds = req.body.children;
  
  if (!childrenIds || !Array.isArray(childrenIds) || childrenIds.length === 0) {
    return res.status(400).json({ error: "No children provided" });
  }

  try {
    const genderResult = await client`SELECT gender FROM members Where member_id = ${member_id}`;

    if (genderResult.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    const memberGender = genderResult[0].gender;
    const marriageResult = memberGender === true 
      ? await client`SELECT couple_id FROM couples WHERE husband_id = ${member_id};`
      : await client`SELECT couple_id FROM couples WHERE wife_id = ${member_id};`;

    if (marriageResult.length === 0 || !marriageResult[0].couple_id) {
      return res.status(404).json({ error: "Couples not found. Member must be married to add children." });
    }

    const couple_id = marriageResult[0].couple_id;
    const addedChildren = [];

    for (const child_id of childrenIds) {
      // Check if child already has parents
      const childExist = await client`SELECT * FROM parent_child WHERE child_id = ${child_id}`;

      if (childExist.length > 0) {
        continue; // Skip if child already has parents
      }

      // Check if this specific combination already exists
      const comboExist = await client`SELECT 1 FROM parent_child WHERE couple_id = ${couple_id} AND child_id = ${child_id}`;

      if (comboExist.length === 0) {
        await client`INSERT INTO parent_child (couple_id , child_id) VALUES (${couple_id}, ${child_id})`;
        addedChildren.push(child_id);
      }
    }

    return res.status(201).json({ success: true, addedCount: addedChildren.length });
  } catch (error) {
    console.log("Error in Parents Child Creation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getParentChild(req, res) {
  const member_id = req.params.id;

  const genderResult = await client`SELECT gender FROM members Where member_id = ${member_id}`;

  if (genderResult.length === 0) {
    return res.status(404).json({ error: "Member not found" });
  }

  const memberGender = genderResult[0].gender;

  const marriageResult = memberGender === true 
    ? await client`SELECT couple_id FROM couples WHERE husband_id = ${member_id};`
    : await client`SELECT couple_id FROM couples WHERE wife_id = ${member_id};`;

  if (marriageResult.length === 0 || marriageResult[0].couple_id === null) {
    return res.status(404).json({ error: "Not Married" });
  }

  try {
    const couple_id = marriageResult[0].couple_id;

    const result = await client`SELECT m.member_id AS child_id, m.name AS child_name FROM parent_child c JOIN members m ON c.child_id = m.member_id WHERE c.couple_id = ${couple_id}`;
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log("Error in Finding Children", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllChildren(req, res) {
  const family_id = req.params.id;

  try {
    const result = await client`SELECT ch.* FROM parent_child ch JOIN members m ON ch.child_id = m.member_id JOIN family_members f ON m.member_id = f.member_id WHERE f.family_id = ${family_id}`;

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("Error in Fetching all children", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteParentChild(req, res) {
  const member_id = req.params.id;
  const child_id = req.body.member_id;
  const genderResult = await client`SELECT gender FROM members Where member_id = ${member_id}`;

  if (genderResult.length === 0) {
    return res.status(404).json({ error: "Member not found" });
  }

  const memberGender = genderResult[0].gender;

  const marriageResult = memberGender === true 
    ? await client`SELECT couple_id FROM couples WHERE husband_id = ${member_id};`
    : await client`SELECT couple_id FROM couples WHERE wife_id = ${member_id};`;

  if (marriageResult.length === 0 || marriageResult[0].couple_id === null) {
    return res.status(404).json({ error: "Couples not found" });
  }

  async function checkParentChildCombination(couple_id, child_id) {
    const result = await client`
    SELECT EXISTS (
      SELECT 1 FROM parent_child
      WHERE couple_id = ${couple_id} AND child_id = ${child_id}
    ) AS exists;
  `;

    return result[0].exists;
  }

  const couple_id = marriageResult.rows[0].couple_id;
  try {
    checkParentChildCombination(couple_id, child_id).then(async (exists) => {
      if (!exists) {
        return res.status(400).json({ message: "Combination Not exists!" });
      }
      await client`DELETE FROM parent_child WHERE couple_id = ${couple_id} AND child_id = ${child_id}`;
      return res.status(201).json({ success: true });
    });
  } catch (error) {
    console.log("Error in Deleting  Parent Child", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
