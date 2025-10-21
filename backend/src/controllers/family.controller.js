import { client } from "../lib/db.js";

export async function createFamily(req, res) {
  console.log(req.body.familyName);

  const family_name = req.body.familyName;
  const userid = req.user.userid;

  const result = await client.query(
    "SELECT EXISTS (SELECT 1 FROM families WHERE family_name = $1 AND created_user = $2)",
    [family_name, userid]
  );
  console.log(result.rows[0].exists);

  try {
    if (!family_name) {
      return res.status(400).json({ message: "Family Name required" });
    } else if (result.rows[0].exists) {
      return res.status(400).json({ message: "Family Name Already Exist" });
    } else {
      await client.query(
        "INSERT INTO families (family_name , created_user) VALUES ($1,$2)",
        [family_name, userid]
      );

      return res.status(201).json({ success: true });
    }
  } catch (error) {
    console.log("Error in Family Creation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFamily(req, res) {
  const family_id = req.params.id;
  const userid = req.user.userid;

  try {
    if (!family_id) {
      return res.status(400).json({ message: "Family not found" });
    } else {
      const result = await client.query(
        "SELECT family_name FROM families WHERE family_id =($1) AND created_user = ($2)",
        [family_id, userid]
      );

      return res.status(200).json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.log("Error in Finding Family", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllFamily(req, res) {
  const userid = req.user.userid;
  try {
    const result = await client.query(
      "SELECT family_id, family_name FROM families WHERE created_user = ($1)",
      [userid]
    );

    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.log("Error in Fetching Families", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function editFamily(req, res) {
  const family_name = req.body.family_name;
  const family_id = req.params.id;

  const Res = await client.query(
    "SELECT family_name FROM families WHERE family_id = $1",
    [family_id]
  );
  const oldFamilyName = Res.rows[0].family_name;

  try {
    if (!family_id) {
      return res.status(400).json({ message: "Family not found" });
    }
    if (!family_name) {
      return res.status(400).json({ message: "Family name required" });
    }
    if (oldFamilyName === family_name) {
      return res.status(400).json({ message: "Family name Not Changed" });
    }

    const result = await client.query(
      "UPDATE families SET family_name = $1 WHERE family_id = $2 RETURNING *",
      [family_name, family_id]
    );

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.log("Error in Editing Family Name", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteFamily(req, res) {
  const family_id = req.params.id;

  try {
    if (!family_id) {
      return res.status(400).json({ message: "Family not found" });
    } else {
      await client.query("DELETE FROM families WHERE family_id =($1)", [
        family_id,
      ]);

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error in Deleting Family", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteAllFamily(req, res) {
  const userid = req.user.userid;
  try {
    await client.query("DELETE FROM families WHERE created_user = ($1)", [
      userid,
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in Deleting All Family", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
