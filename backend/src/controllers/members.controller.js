import { client } from "../lib/db.js";

const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export async function createMember(req, res) {
  const { name, gender, age, date_of_birth, date_of_death, blood_group } =
    req.body.member;
  const userid = req.user.userid;

  try {
    if (!name || gender === undefined || gender === null || gender === "" || !age) {
      return res.status(400).json({
        message: "Name, Gender and Age fields are required",
        missingFields: [
          !name && "name",
          (gender === undefined || gender === null || gender === "") && "gender",
          !age && "age",
        ].filter(Boolean),
      });
    } else {
      const formatted_dob = isValidDate(date_of_birth) ? date_of_birth : null;
      const formatted_dod = isValidDate(date_of_death) ? date_of_death : null;
      const parsed_age = parseInt(age);

      await client`INSERT INTO members (name, gender, age, date_of_birth, date_of_death, blood_group, created_user) VALUES (${name}, ${gender}, ${parsed_age}, ${formatted_dob}, ${formatted_dod}, ${blood_group || null}, ${userid})`;

      return res.status(201).json({ success: true });
    }
  } catch (error) {
    console.log("Error in Member Creation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMember(req, res) {
  const member_id = req.params.id;
  const userid = req.user.userid;

  try {
    if (!member_id) {
      return res.status(400).json({ message: "Member not found" });
    } else {
      const result = await client`SELECT * FROM members WHERE member_id = ${member_id} AND created_user = ${userid}`;

      return res.status(200).json({ success: true, data: result[0] });
    }
  } catch (error) {
    console.log("Error in Finding Member", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllUnmarriedMales(req, res) {
  const userid = req.user.userid;

  try {
    const result = await client`SELECT m.member_id, m.name, m.age FROM members m WHERE m.created_user = ${userid} AND m.gender = true AND m.member_id NOT IN ( SELECT c.husband_id FROM couples c);`;

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("Error in Fetching UnmarriedMales", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllUnmarriedFemales(req, res) {
  const userid = req.user.userid;

  try {
    const result = await client`SELECT m.member_id, m.name, m.age FROM members m WHERE m.created_user = ${userid} AND m.gender = false AND m.member_id NOT IN ( SELECT c.wife_id FROM couples c);`;

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("Error in Fetching UnmarriedFemales", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllRemainingChildren(req, res) {
  const userid = req.user.userid;

  try {
    const result = await client`SELECT m.member_id, m.name FROM members m LEFT JOIN parent_child pc ON m.member_id = pc.child_id WHERE pc.child_id IS NULL AND m.created_user = ${userid};`;

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("Error in Fetching AllChildren", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllMembers(req, res) {
  const userid = req.user.userid;

  try {
    const result = await client`SELECT member_id,name,age FROM members WHERE created_user = ${userid}`;

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("Error in Fetching Members", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getRecommendedMembers(req, res) {
  const userid = req.user.userid;
  const family_id = req.params.id;

  try {
    const result = await client`
      SELECT m.member_id, m.name, m.age
      FROM members m
      WHERE m.created_user = ${userid}
      AND m.member_id NOT IN (
        SELECT fm.member_id
        FROM family_members fm
        WHERE fm.family_id = ${family_id}
      )
      ORDER BY m.name ASC
      `;

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching recommended members:", error);
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

      await client`UPDATE members SET 
        name = COALESCE(${name}, name),
        gender = COALESCE(${gender}, gender),
        age = COALESCE(${age}, age),
        date_of_birth = COALESCE(${date_of_birth}, date_of_birth),
        date_of_death = COALESCE(${date_of_death}, date_of_death),
        blood_group = COALESCE(${blood_group}, blood_group)
      WHERE member_id = ${member_id}`;

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error in Editing Member Details", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteMember(req, res) {
  const member_id = req.params.id;
  const userid = req.user.userid;

  try {
    if (!member_id) {
      return res.status(400).json({ message: "Member not found" });
    } else {
      await client`DELETE FROM members WHERE member_id = ${member_id} AND created_user = ${userid}`;

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error in Deleting Member", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteAllMembers(req, res) {
  const userid = req.user.userid;

  try {
    await client`DELETE FROM members WHERE created_user = ${userid}`;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in Deleting All Members", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
