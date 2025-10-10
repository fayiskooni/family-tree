import { client } from "../lib/db.js";

export async function createMember(req, res) {
  const { name, gender, age, date_of_birth, date_of_death, blood_group } =
    req.body;

  try {
    if (!name || !gender || !age) {
      return res.status(400).json({
        message: "Name , Gender and Age fields are required",
        missingFields: [
          !name && "name",
          !gender && "gender",
          !age && "age",
        ].filter(Boolean),
      });
    } else {
      await client.query(
        "INSERT INTO members (name, gender, age, date_of_birth, date_of_death, blood_group) VALUES ($1,$2,$3,$4,$5,$6)",
        [name, gender, age, date_of_birth, date_of_death, blood_group]
      );

      return res.status(201).json({ success: true });
    }
  } catch (error) {
    console.log("Error in Member Creation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMember(req, res) {
  const member_id = req.params.id;

  try {
    if (!member_id) {
      return res.status(400).json({ message: "Member not found" });
    } else {
      const result = await client.query(
        "SELECT * FROM members WHERE member_id =($1)",
        [member_id]
      );

      return res.status(200).json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.log("Error in Finding Member", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function editMember(req, res) {
  const { name, gender, age, date_of_birth, date_of_death, blood_group } =
    req.body;
  const member_id = req.params.id;
  try {
    if (!member_id) {
      return res.status(400).json({ message: "Member not found" });
    } else {
      const allowedFields = [
        "name",
        "gender",
        "age",
        "date_of_birth",
        "date_of_death",
        "blood_group",
      ];

      const updates = []; // Holds SQL fragments like "name = $1"
      const values = []; // Holds the actual values to update

      let idx = 1; // Parameter index for SQL placeholders

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates.push(`${field} = $${idx}`); // e.g., "name = $1"
          values.push(req.body[field]); // e.g., "John"
          idx++;
        }
      }

      values.push(member_id);

      const sql = `UPDATE members SET ${updates.join(
        ", "
      )} WHERE member_id = $${idx}`;
      await client.query(sql, values);

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error in Editing Member Details", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteMember(req, res) {
  const member_id = req.params.id;

  try {
    if (!member_id) {
      return res.status(400).json({ message: "Member not found" });
    } else {
      await client.query("DELETE FROM members WHERE member_id =($1)", [
        member_id,
      ]);

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error in Deleting Member", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteAllMembers(req, res) {
  try {
    await client.query("DELETE FROM members");

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in Deleting All Members", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
