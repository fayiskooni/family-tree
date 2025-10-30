import React from "react";
import {
  BookOpen,
  Home,
  Users,
  UserPlus,
  Link as LinkIcon,
  TreePine,
  Pencil,
  Info,
} from "lucide-react";

export default function HowToUse() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="w-7 h-7 text-blue-600" />
        How to Use Family Tree
      </h1>

      {/* Step 1 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <Home className="w-6 h-6 text-green-600" />
          1️⃣ Create a Family
        </h2>
        <p className="leading-relaxed">
          Go to the <strong>Home</strong> or <strong>Family</strong> page (both work the same way).
          Click on <strong>"Create Family"</strong> to make a new family record, give it a name, and save.
          <br />
          <span className="text-sm text-gray-600">
             You can create multiple families and manage each separately.
          </span>
        </p>
      </section>

      {/* Step 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <Users className="w-6 h-6 text-pink-600" />
          2️⃣ Add Family Members
        </h2>
        <p className="leading-relaxed">
          Navigate to the <strong>Members</strong> page. Click{" "}
          <strong>"Add Member"</strong> to create people who belong to your family.
          Fill in details such as <strong>Name</strong> and <strong>Gender</strong>.
          <br />
          <span className="text-sm text-gray-600">
             Add all members before creating relationships between them.
          </span>
        </p>
      </section>

      {/* Step 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <Pencil className="w-6 h-6 text-yellow-600" />
          3️⃣ Add Members to a Family
        </h2>
        <p className="leading-relaxed">
          Go back to the <strong>Family</strong> page and open the family you created.
          You’ll see a <strong>✏️ pencil icon</strong> near the family button — hover and click it.
          From there, choose members to include in that family and save.
          <br />
          <span className="text-sm text-gray-600">
             Once added, they’ll appear in that family’s member list.
          </span>
        </p>
      </section>

      {/* Step 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <LinkIcon className="w-6 h-6 text-purple-600" />
          4️⃣ Create Relationships
        </h2>
        <p className="leading-relaxed">
          In the <strong>Family</strong> page, select your family and open the members list.
          Click on a member to <strong>add a relation</strong> (e.g., husband, wife, child).
          <br />
          You only need to update one member — it automatically updates for the other person.
          <br />
          <span className="text-sm text-gray-600">
             Example: If A selects B as wife, then B’s details automatically show A as husband.
          </span>
        </p>
      </section>

      {/* Step 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <TreePine className="w-6 h-6 text-emerald-600" />
          5️⃣ View Your Family Tree
        </h2>
        <p className="leading-relaxed">
          Once relationships are added, look near the <strong>✏️ pencil icon</strong> again.
          You’ll see a button labeled <strong>“View My Family Tree”</strong>.
          Click it to open an <strong>interactive visual tree</strong> that shows your entire family.
          <br />
          <span className="text-sm text-gray-600">
             You can zoom, pan, and explore each branch easily.
          </span>
        </p>
      </section>

      {/* Step 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-600" />
          ⚙️ Note on Performance
        </h2>
        <p className="leading-relaxed">
          This project uses <strong>free-tier hosting</strong> services on <strong>Render</strong> and
          a <strong>Neon database</strong>.  
          As a result, the app may feel a little slow at times — especially when waking up from sleep.
          <br />
          <span className="text-sm text-gray-600">
             Don’t worry — just wait a few seconds; everything will load correctly!
          </span>
        </p>
      </section>

      {/* Step 7 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">🎉 All Done!</h2>
        <p className="leading-relaxed">
          You’ve successfully created your digital family tree!  
          You can now edit members, add new families, or explore your beautiful tree anytime.
        </p>
      </section>
    </div>
  );
}
