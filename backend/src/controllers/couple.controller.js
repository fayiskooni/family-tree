import { client } from "../lib/db.js";

export async function createCouple(req, res) {
  const member_id = req.params.id;
  const genderResult = await client`SELECT gender FROM members Where member_id = ${member_id}`;

  if (genderResult.length === 0) {
    return res.status(404).json({ error: "Member not found" });
  }

  const memberGender = genderResult[0].gender;

  const bodyMemberId = req.body.partnerId;

  const bodyGenderResult = await client`SELECT gender FROM members WHERE member_id = ${bodyMemberId}`;

  if (bodyGenderResult.length === 0) {
    return res.status(404).json({ error: "Member from body not found" });
  }

  const bodyGender = bodyGenderResult[0].gender;

  if (memberGender === bodyGender) {
    return res
      .status(400)
      .json({ error: "Invalid combination: both have same gender" });
  }

  let husband_id, wife_id;

  if (memberGender === true && bodyGender === false) {
    husband_id = member_id;
    wife_id = bodyMemberId;
  } else if (memberGender === false && bodyGender === true) {
    husband_id = bodyMemberId;
    wife_id = member_id;
  } else {
    return res.status(400).json({ error: "Invalid gender combination" });
  }

  async function checkMarriageStatus(husband_id, wife_id) {
    const result = await client`
    SELECT 
      CASE
        WHEN EXISTS (SELECT 1 FROM couples WHERE husband_id = ${husband_id}) THEN 'husband_married'
        WHEN EXISTS (SELECT 1 FROM couples WHERE wife_id = ${wife_id}) THEN 'wife_married'
        ELSE 'available'
      END AS status;
  `;

    return result[0].status; // 'husband_married', 'wife_married', or 'available'
  }

  try {
    checkMarriageStatus(husband_id, wife_id).then(async (status) => {
      if (status === "husband_married") {
        return res.status(400).json({ message: "Husband is already married!" });
      } else if (status === "wife_married") {
        return res.status(400).json({ message: "Wife is already married!" });
      } else {
        const result = await client`INSERT INTO couples (husband_id , wife_id) VALUES (${husband_id}, ${wife_id}) RETURNING *`;

        return res.status(201).json({ success: true, data: result[0] });
      }
    });
  } catch (error) {
    console.log("Error in Couple Creation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getCouple(req, res) {
  const member_id = req.params.id;

  const genderResult = await client`SELECT gender FROM members Where member_id = ${member_id}`;

  if (genderResult.length === 0) {
    return res.status(404).json({ error: "Member not found" });
  }

  const memberGender = genderResult[0].gender;

  let marriageResult;

  if (memberGender === true) {
    marriageResult = await client`
    SELECT m.name, c.wife_id, c.husband_id
    FROM couples c
    JOIN members m ON m.member_id = c.wife_id
    WHERE c.husband_id = ${member_id};
  `;
  } else {
    marriageResult = await client`
    SELECT m.name, c.wife_id, c.husband_id
    FROM couples c
    JOIN members m ON m.member_id = c.husband_id
    WHERE c.wife_id = ${member_id};
  `;
  }

  try {
    if (marriageResult.length > 0) {
      return res
        .status(201)
        .json({ success: true, data: marriageResult[0] });
    } else {
      // return res.status(404).json({ error: "Member not Married" });
    }
  } catch (error) {
    console.log("Error in Finding Couple Name", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllCouples(req, res) {
  const family_id = req.params.id;
  try {
    const result = await client`SELECT DISTINCT c.* FROM couples c JOIN members m ON (c.husband_id = m.member_id OR c.wife_id = m.member_id) JOIN family_members f ON m.member_id = f.member_id WHERE f.family_id = ${family_id}`;

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("Error in Fetching all couples", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteCouple(req, res) {
  const member_id = req.params.id;
  const genderResult = await client`SELECT gender FROM members Where member_id = ${member_id}`;

  if (genderResult.length === 0) {
    return res.status(404).json({ error: "Member not found" });
  }

  const memberGender = genderResult[0].gender;

  try {
    let marriageResult;
    if (memberGender === true) {
      marriageResult = await client`SELECT * FROM couples WHERE husband_id = ${member_id}`;
      if (marriageResult.length > 0) {
        await client`DELETE FROM couples WHERE husband_id = ${member_id}`;
        return res.status(200).json({ success: true });
      }
    } else {
      marriageResult = await client`SELECT * FROM couples WHERE wife_id = ${member_id}`;
      if (marriageResult.length > 0) {
        await client`DELETE FROM couples WHERE wife_id = ${member_id}`;
        return res.status(200).json({ success: true });
      }
    }

    return res.status(404).json({ error: "Member not Married" });
  } catch (error) {
    console.log("Error in Deleting Couple", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
