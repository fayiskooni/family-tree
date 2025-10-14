import { client } from "../lib/db.js";

export async function createFamily(req, res) {
  const family_name = req.body.family_name;

  try {
    if (!family_name) {
      return res.status(400).json({ message: "Family Name required" });
    } else {
      const userid = req.user.userid;

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

  try {
    if (!family_id) {
      return res.status(400).json({ message: "Family not found" });
    } else {
      const result = await client.query(
        "SELECT family_name FROM families WHERE family_id =($1)",
        [family_id]
      );

      return res.status(200).json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.log("Error in Finding Family", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllFamily(req, res) {
  try {
    const result = await client.query("SELECT family_name FROM families");

    return res.status(200).json({ success: true, data: result.rows});
  } catch (error) {
    console.log("Error in Fetching Families", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function editFamily(req, res) {
  const family_name = req.body.family_name;
  const family_id = req.params.id;

  try {
    if (!family_id) {
      return res.status(400).json({ message: "Family not found" });
    } else {
      const result = await client.query(
        "UPDATE families SET family_name =($1) WHERE family_id =($2)",
        [family_name, family_id]
      );

      return res.status(200).json({ success: true, data: result.rows[0] });
    }
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
  try {
    await client.query("DELETE FROM families");

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in Deleting All Family", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
