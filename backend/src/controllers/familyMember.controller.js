import { client } from "../lib/db.js";

export async function createFamilyMember(req, res) {
  const family_id = req.params.id;
  const member_id = req.body.member_id;

  async function checkCombination(family_id, member_id) {
    const query = `
    SELECT EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = $1 AND member_id = $2
    ) AS exists;
  `;
    const result = await client.query(query, [family_id, member_id]);

    // result.rows[0].exists will be true or false
    return result.rows[0].exists;
  }

  try {
    if (!family_id) {
      return res.status(400).json({ message: "Family not found" });
    }
    checkCombination(family_id, member_id).then((exists) => {
      if (exists) {
        return res.status(400).json({ message: "Combination already exists!" });
      }
    });
    const result = await client.query(
      "INSERT INTO family_members (family_id , member_id) VALUES ($1,$2)",
      [family_id, member_id]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.log("Error in Family Member Creation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFamilyMembers(req, res) {
  const family_id = req.params.id;
  try {
    if (!family_id) {
      return res.status(400).json({ message: "Family not found" });
    } else {
      const result = await client.query(
        "SELECT name FROM members AS m JOIN family_members AS fm ON m.member_id = fm.member_id WHERE fm.family_id =($1)",
        [family_id]
      );

      return res.status(200).json({ success: true, data: result.rows });
    }
  } catch (error) {
    console.log("Error in Finding Member", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteFamilyMember(req, res) {
  const family_id = req.params.id;
  const member_id = req.body.member_id;

  try {
    if (!family_id) {
      return res.status(400).json({ message: "Family not found" });
    } else {
      await client.query(
        "DELETE FROM family_members WHERE family_id =($1) AND member_id =($2)",
        [family_id, member_id]
      );

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error in Deleting Family Member", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteAllFAmilyMembers(req, res) {
  try {
    await client.query("DELETE FROM family_members");

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in Deleting All Family Members", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
