import { client } from "../lib/db.js";

export async function createCouple(req, res) {
  const member_id = req.params.id;
  const gender = await client.query(
    "SELECT gender FROM members Where member_id = ($1)",
    [member_id]
  );

  const husband_id = gender ? member_id : req.body.member_id;
  const wife_id = gender ? req.body.member_id : member_id;

  async function checkCombination(husband_id, wife_id) {
    const query = `
    SELECT EXISTS (
      SELECT 1 FROM couples
      WHERE husband_id = $1 AND wife_id = $2
    ) AS exists;
  `;
    const result = await client.query(query, [husband_id, wife_id]);

    // result.rows[0].exists will be true or false
    return result.rows[0].exists;
  }

  try {
    checkCombination(husband_id, wife_id).then(async (exists) => {
      if (exists) {
        return res.status(400).json({ message: "Combination already exists!" });
      }

      const result = await client.query(
        "INSERT INTO couples (husband_id , wife_id) VALUES ($1,$2)",
        [husband_id, wife_id]
      );

      return res.status(201).json({ success: true, data: result.rows[0] });
    });
  } catch (error) {
    console.log("Error in Couple Creation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getCouple(req, res) {
  const member_id = req.params.id;
  const gender = await client.query(
    "SELECT gender FROM members Where member_id = ($1)",
    [member_id]
  );

  const husband_id = gender ? member_id : req.body.member_id;
  const wife_id = gender ? req.body.member_id : member_id;

  async function checkCombination(husband_id, wife_id) {
    const query = `
    SELECT EXISTS (
      SELECT 1 FROM couples
      WHERE husband_id = $1 AND wife_id = $2
    ) AS exists;
  `;
    const result = await client.query(query, [husband_id, wife_id]);

    // result.rows[0].exists will be true or false
    return result.rows[0].exists;
  }
  try {
    checkCombination(husband_id, wife_id).then(async (exists) => {
      if (!exists) {
        return res.status(400).json({ message: "Combination not exists!" });
      }

      const result = await client.query(
        "SELECT * FROM couples WHERE husband_id = ($1) AND wife_id = ($2)",
        [husband_id, wife_id]
      );

      return res.status(201).json({ success: true, data: result.rows[0] });
    });
  } catch (error) {
    console.log("Error in Finding Couple", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteCouple(req, res) {
  const member_id = req.params.id;
  const gender = await client.query(
    "SELECT gender FROM members Where member_id = ($1)",
    [member_id]
  );

  const husband_id = gender ? member_id : req.body.member_id;
  const wife_id = gender ? req.body.member_id : member_id;

  async function checkCombination(husband_id, wife_id) {
    const query = `
    SELECT EXISTS (
      SELECT 1 FROM couples
      WHERE husband_id = $1 AND wife_id = $2
    ) AS exists;
  `;
    const result = await client.query(query, [husband_id, wife_id]);

    // result.rows[0].exists will be true or false
    return result.rows[0].exists;
  }

  try {
    checkCombination(husband_id, wife_id).then(async (exists) => {
      if (!exists) {
        return res.status(400).json({ message: "Combination not exists!" });
      }

      const result = await client.query(
        "DELETE FROM couples WHERE husband_id =($1) AND wife_id =($2)",
        [husband_id, wife_id]
      );

      return res.status(200).json({ success: true });
    });
  } catch (error) {
    console.log("Error in Deleting Family Member", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
