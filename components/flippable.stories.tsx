import { Meta, StoryObj } from "@storybook/react/*";
import { Flippable, FlippableRef } from "./flippable";
import { Button } from "./button";
import { useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Table, TableColumn } from "./table";

const meta: Meta<typeof Flippable> = {
  title: "Stage/Flippable",
  component: Flippable,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Flippable** is an interactive container component that displays front and back content with a smooth 3D flip animation. It supports imperative controls, customizable dimensions, animation duration, and fully customizable styles for both faces.

---

### ✨ Features

* 🔄 **3D flip animation**: Smooth card flip transition between front and back content.
* 🎛 **Imperative controls**: Programmatically control flipping using \`flip\`, \`unFlip\`, and \`toggle\` methods via refs.
* 🖱 **Click interaction**: Supports automatic flipping via the flipOnClick prop and provides an onClick callback with flip, unFlip, and toggle actions for custom flip behavior.
* ⏱ **Customizable animation duration**: Adjust flip speed using the \`flipDuration\` prop (in second).
* 🎨 **Customizable styles**: Override container, front face, and back face styles using styled-components \`CSSProp\`.
* 📏 **Flexible sizing**: Configure width and height using numbers or CSS values.
* 🧩 **Flexible content**: Render any ReactNode on the front and back faces.
* 🎭 **Theme support**: Supports separate theme styling for front and back faces.

---

### 📌 Usage

\`\`\`tsx
<Flippable
  width={280}
  height={180}
  flipDuration={0.6}
  back={
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Back Side
    </div>
  }
>
  <div
    style={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Front Side
  </div>
</Flippable>
\`\`\`

* Click the component to toggle between front and back faces.
* Use \`flipDuration\` to control the transition speed.
* Use \`width\` and \`height\` to define the component size.
* Customize appearance through \`styles.self\`, \`styles.frontStyle\`, and \`styles.backStyle\`.
* Access \`flip\`, \`unFlip\`, and \`toggle\` methods through a component ref for programmatic control.
* Render any ReactNode on either side to create cards, flashcards, product previews, profile cards, or interactive content.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Flippable>;

export const Default: Story = {
  render: () => {
    const ref = useRef<FlippableRef>(null);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Flippable
          width={260}
          ref={ref}
          onClick={({ toggle }) => {
            toggle();
          }}
          back={
            <>
              <div>
                <BackTitle>Contact</BackTitle>
                <LinkList>
                  <ContactLink
                    onClick={(e) => e.stopPropagation()}
                    href="mailto:adam@systatum.com"
                  >
                    📧 adam@systatum.com
                  </ContactLink>
                  <ContactLink
                    onClick={(e) => e.stopPropagation()}
                    href="https://linkedin.com/in/adamhakarsa"
                    target="_blank"
                    rel="noreferrer"
                  >
                    💼 linkedin.com/in/adamhakarsa
                  </ContactLink>
                </LinkList>
              </div>
              <BackHint>← Click to go back</BackHint>
            </>
          }
          styles={{
            frontStyle: css`
              background-color: #0077b5;
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              color: #fff;
            `,
            backStyle: css`
              background-color: #004182;
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              color: #fff;
            `,
          }}
        >
          <div>
            <FrontLabel>CEO</FrontLabel>
            <FrontName>Adam Hakarsa</FrontName>
            <FrontRole>Systatum · adam@systatum.com</FrontRole>
          </div>
          <FrontHint>Click to see links →</FrontHint>
        </Flippable>
        <div style={{ display: "flex", gap: "4px" }}>
          <Button onClick={() => ref.current?.flip()}>Show back</Button>
          <Button onClick={() => ref.current?.unFlip()}>Show front</Button>
          <Button onClick={() => ref.current?.toggle()}>Toggle</Button>
        </div>
      </div>
    );
  },
};

export const OnTable: Story = {
  render: () => {
    interface Person {
      name: string;
      role: string;
      backgroundColor: string;
      email: string;
      employeeId: string;
      department: string;
    }
    const PEOPLE: Person[] = [
      {
        name: "Adam Hakarsa",
        role: "CEO",
        backgroundColor: "#0077b5",
        email: "adam@systatum.com",
        employeeId: "SYS-001",
        department: "Executive",
      },
      {
        name: "Alim Naufal",
        role: "Frontend Engineer",
        backgroundColor: "#6c5ce7",
        email: "alim@systatum.com",
        employeeId: "SYS-002",
        department: "Engineering",
      },
      {
        name: "Sarah Amira",
        role: "Product Designer",
        backgroundColor: "#e17055",
        email: "sarah@systatum.com",
        employeeId: "SYS-003",
        department: "Design",
      },
      {
        name: "Kevin Tan",
        role: "QA Engineer",
        backgroundColor: "#00b894",
        email: "kevin@systatum.com",
        employeeId: "SYS-004",
        department: "Quality Assurance",
      },
      {
        name: "Budi Santoso",
        role: "Backend Engineer",
        backgroundColor: "#0984e3",
        email: "budi@systatum.com",
        employeeId: "SYS-005",
        department: "Engineering",
      },
      {
        name: "Rina Prasetyo",
        role: "Product Manager",
        backgroundColor: "#fd79a8",
        email: "rina@systatum.com",
        employeeId: "SYS-006",
        department: "Product",
      },
      {
        name: "Michael Ong",
        role: "DevOps Engineer",
        backgroundColor: "#636e72",
        email: "michael@systatum.com",
        employeeId: "SYS-007",
        department: "Infrastructure",
      },
      {
        name: "Nadia Putri",
        role: "UI Designer",
        backgroundColor: "#f39c12",
        email: "nadia@systatum.com",
        employeeId: "SYS-008",
        department: "Design",
      },
      {
        name: "Daniel Wijaya",
        role: "Mobile Engineer",
        backgroundColor: "#8e44ad",
        email: "daniel@systatum.com",
        employeeId: "SYS-009",
        department: "Engineering",
      },
      {
        name: "Jonathan Lee",
        role: "Backend Engineer",
        backgroundColor: "#16a085",
        email: "jonathan@systatum.com",
        employeeId: "SYS-010",
        department: "Engineering",
      },
      {
        name: "Aisyah Rahman",
        role: "HR Manager",
        backgroundColor: "#c0392b",
        email: "aisyah@systatum.com",
        employeeId: "SYS-011",
        department: "Human Resources",
      },
      {
        name: "William Tan",
        role: "Data Engineer",
        backgroundColor: "#2980b9",
        email: "william@systatum.com",
        employeeId: "SYS-012",
        department: "Data",
      },
      {
        name: "Felicia Lim",
        role: "Marketing Manager",
        backgroundColor: "#d35400",
        email: "felicia@systatum.com",
        employeeId: "SYS-013",
        department: "Marketing",
      },
      {
        name: "Andre Kurniawan",
        role: "Security Engineer",
        backgroundColor: "#2c3e50",
        email: "andre@systatum.com",
        employeeId: "SYS-014",
        department: "Security",
      },
      {
        name: "Cindy Hartono",
        role: "Customer Success",
        backgroundColor: "#27ae60",
        email: "cindy@systatum.com",
        employeeId: "SYS-015",
        department: "Customer Success",
      },
    ];

    const [person, setPerson] = useState<Person | null>(PEOPLE[0]);

    const ref = useRef<FlippableRef>(null);

    const columns: TableColumn[] = [
      {
        id: "name",
        caption: "Name",
        sortable: false,
      },
      {
        id: "role",
        caption: "Role",
        sortable: false,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
        }}
      >
        <Flippable
          ref={ref}
          width={420}
          height={350}
          flipDuration={0.7}
          onClick={({ toggle }) => {
            toggle();
          }}
          back={
            person && (
              <>
                <div>
                  <Label>Employee Profile</Label>
                  <Name>{person.name}</Name>
                  <Value>{person.role}</Value>
                </div>

                <div>
                  <Label>Email</Label>
                  <Value>{person.email}</Value>
                </div>

                <div>
                  <Label>Department</Label>
                  <Value>{person.department}</Value>
                </div>

                <div>
                  <Label>Employee ID</Label>
                  <Value>{person.employeeId}</Value>
                </div>

                <Hint>← Click "Show table" to return</Hint>
              </>
            )
          }
          styles={{
            backStyle: css`
              background: ${person?.backgroundColor ?? "#0077b5"};
              padding: 24px;
              color: white;
              display: flex;
              flex-direction: column;
              gap: 16px;
            `,
          }}
        >
          <Table columns={columns}>
            {PEOPLE.map((person) => (
              <Table.Row
                key={person.employeeId}
                rowId={person.employeeId}
                content={[person.name, person.role]}
                onClick={() => {
                  setPerson(person);
                }}
              />
            ))}
          </Table>
        </Flippable>

        <div style={{ display: "flex", gap: 4 }}>
          <Button onClick={() => ref.current?.flip()}>Show profile</Button>

          <Button onClick={() => ref.current?.unFlip()}>Show table</Button>

          <Button onClick={() => ref.current?.toggle()}>Toggle</Button>
        </div>
      </div>
    );
  },
};

const Label = styled.p`
  margin: 0 0 4px;
  font-size: 11px;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const Value = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
`;

const Hint = styled.p`
  margin-top: auto;
  font-size: 12px;
  opacity: 0.7;
`;

const FrontLabel = styled.p`
  margin: 0 0 4px;
  font-size: 11px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const FrontName = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
`;

const FrontRole = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.8;
`;

const FrontHint = styled.p`
  margin: 0;
  font-size: 12px;
  opacity: 0.6;
`;

const BackTitle = styled.p`
  margin: 0 0 12px;
  font-size: 11px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ContactLink = styled.a`
  font-size: 13px;
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.9;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

const BackHint = styled.p`
  margin: 0;
  font-size: 12px;
  opacity: 0.6;
`;
