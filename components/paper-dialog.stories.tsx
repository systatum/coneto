import { Meta, StoryObj } from "@storybook/react";
import { PaperDialog, PaperDialogRef } from "./paper-dialog";
import { Button } from "./button";
import { StatefulForm, FormFieldProps } from "./stateful-form";
import { Fragment, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { COUNTRY_CODES } from "./../constants/countries";
import { css } from "styled-components";
import { Card } from "./card";
import { TableColumn, TableSubMenuList, Table } from "./table";
import {
  RiAddBoxLine,
  RiCheckLine,
  RiDeleteBin2Line,
  RiEdit2Line,
  RiSubtractLine,
} from "@remixicon/react";

const meta: Meta<typeof PaperDialog> = {
  title: "Stage/PaperDialog",
  component: PaperDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
📄 **PaperDialog** is a fully customizable slide-in dialog component that can appear from the left or right side of the viewport. 

### ✨ Features
- 🎬 Slide-in / Slide-out animations using Framer Motion
- 🟢 Supports three states: \`restored\`, \`minimized\`, and \`closed\`
- ❌ Optional close button and minimize toggle
- 🛡 Overlay blocker when restored to prevent outside interactions
- 🎛 Trigger opening/closing externally
- 🎨 Fully styleable via \`styles\` props
- ⌨️ Handles "Escape" key to close the dialog

### 🛠 Usage
\`\`\`tsx
<PaperDialog ref={dialogRef} position="right" closable width="400px">
  <PaperDialog.Trigger>
    Open Dialog
  </PaperDialog.Trigger>
  
  <p>Your content here</p>
</PaperDialog>
\`\`\`

### 🎨 Custom Icons
You can override the default control icons (e.g. close and restore) by passing custom icon components:

\`\`\`tsx
<PaperDialog
  icons={{
    closeIcon: { image: RiCloseLine },
    restoreIcon: { image: RiSubtractLine }
  }}
/>
\`\`\`

### 📝 Notes
- Always include both \`PaperDialog.Trigger\` and \`PaperDialog.Content\` as children.
- Use \`styles\` prop to override default styles.
- Use the \`icons\` prop to override default icons.
        `,
      },
    },
  },
  argTypes: {
    position: {
      description: "Position from which the dialog slides in",
      control: { type: "radio" },
      options: ["left", "right"],
    },
    closable: {
      description:
        "Whether the dialog can be closed via the close button or Escape key",
      control: { type: "boolean" },
    },
    width: {
      description:
        "Width of the dialog. If not provided, min-width defaults to 92vw",
      control: { type: "text" },
    },
    icons: {
      description: `
Customize the dialog control icons.

- \`closeIcon\`: Icon used for closing the dialog
- \`restoreIcon\`: Icon used for toggling minimized/restored state

Each icon accepts:
- \`image\`: React component (icon)
- \`size\`: Icon size (optional)
      `,
      control: false,
    },
    children: {
      description:
        "Children of the dialog, should include `PaperDialog.Trigger` and `PaperDialog.Content`",
      control: false,
    },
    styles: {
      description: "Custom styles for the dialog, tabs, and close button",
      control: false,
    },
    onClosed: {
      description: "Callback fired after the dialog closes",
      action: "closed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PaperDialog>;

export const Default: Story = {
  render: () => {
    const dialogRef = useRef<PaperDialogRef>(null);

    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const [value, setValue] = useState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      note: "",
      access: false,
      country_code: DEFAULT_COUNTRY_CODES,
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const employeeSchema = z.object({
      first_name: z
        .string()
        .min(3, "First name must be at least 3 characters long"),
      last_name: z.string().optional(),
      email: z.string().email("Please enter a valid email address"),
      phone: z
        .string()
        .regex(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits")
        .optional(),
      note: z.string().optional(),
      access: z.boolean().optional(),
    });

    const EMPLOYEE_FIELDS: FormFieldProps[] = [
      {
        name: "first_name",
        title: "First Name",
        type: "text",
        required: true,
      },
      {
        name: "last_name",
        title: "Last Name",
        type: "text",
        required: false,
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: false,
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
      },
      {
        name: "access",
        placeholder: "Has access to login",
        type: "checkbox",
        required: false,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Button onClick={() => dialogRef.current?.openDialog()}>Open</Button>
        <Button onClick={() => dialogRef.current?.closeDialog()}>Close</Button>
        <PaperDialog
          width="35vw"
          styles={{
            contentStyle: {
              padding: "36px",
              gap: "24px",
            },
          }}
          ref={dialogRef}
        >
          <Button onClick={() => dialogRef.current?.minimizeDialog()}>
            Minimize here.
          </Button>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Add New Employee
            </h2>
            <p style={{ fontSize: "14px", color: "#4B5563" }}>
              Fill out the information below to add a new employee to your team.
            </p>
          </div>

          <div
            style={{
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <StatefulForm
              fields={EMPLOYEE_FIELDS}
              formValues={value}
              validationSchema={employeeSchema}
              onValidityChange={setIsFormValid}
              onChange={({ currentState }) =>
                setValue((prev) => ({ ...prev, ...currentState }))
              }
              mode="onChange"
            />

            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Button
                disabled={!isFormValid}
                styles={{
                  self: {
                    width: "100%",
                    cursor: "pointer",
                    maxWidth: "180px",
                  },
                }}
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </PaperDialog>
      </div>
    );
  },
};

export const CustomIcon: Story = {
  render: () => {
    const dialogRef = useRef<PaperDialogRef>(null);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Button onClick={() => dialogRef.current?.openDialog()}>Open</Button>
        <Button onClick={() => dialogRef.current?.closeDialog()}>Close</Button>

        <PaperDialog
          closable={true}
          width="35vw"
          icons={{
            closeIcon: {
              image: RiCheckLine,
            },
            restoreIcon: {
              image: RiSubtractLine,
            },
          }}
          styles={{
            contentStyle: {
              padding: "36px",
              gap: "16px",
            },
          }}
          ref={dialogRef}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            Dialog with Custom Icons
          </h2>

          <p style={{ fontSize: "14px", color: "#4B5563" }}>
            This dialog demonstrates how to customize the close and restore
            icons using the <code>icons</code> prop.
          </p>

          <p style={{ fontSize: "14px", color: "#4B5563" }}>
            You can replace the default icons with any icon component to better
            match your application’s design or interaction needs.
          </p>

          <p style={{ fontSize: "14px", color: "#4B5563" }}>
            In this example, the close action uses a check icon, while the
            restore action uses a subtract icon for a more customized
            appearance.
          </p>
        </PaperDialog>
      </div>
    );
  },
};

export const NonClosable: Story = {
  render: () => {
    const dialogRef = useRef<PaperDialogRef>(null);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Button onClick={() => dialogRef.current?.openDialog()}>Open</Button>
        <Button onClick={() => dialogRef.current?.closeDialog()}>Close</Button>

        <PaperDialog
          closable={false}
          width="35vw"
          styles={{
            contentStyle: {
              padding: "36px",
              gap: "16px",
            },
          }}
          ref={dialogRef}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Non-Escapable Dialog
            </h2>
            <p style={{ fontSize: "14px", color: "#4B5563" }}>
              This dialog cannot be closed by pressing the Escape key or
              clicking the background overlay. Use the close button or action
              buttons to dismiss it.
            </p>
            <p style={{ fontSize: "14px", color: "#4B5563" }}>
              You can still interact with the content and action buttons inside
              the dialog.
            </p>
          </div>
        </PaperDialog>
      </div>
    );
  },
};

export const FixedLeft: Story = {
  render: () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const [value, setValue] = useState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      note: "",
      access: false,
      country_code: DEFAULT_COUNTRY_CODES,
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const employeeSchema = z.object({
      first_name: z
        .string()
        .min(3, "First name must be at least 3 characters long"),
      last_name: z.string().optional(),
      email: z.string().email("Please enter a valid email address"),
      phone: z
        .string()
        .regex(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits")
        .optional(),
      note: z.string().optional(),
      access: z.boolean().optional(),
    });

    const EMPLOYEE_FIELDS: FormFieldProps[] = [
      {
        name: "first_name",
        title: "First Name",
        type: "text",
        required: true,
      },
      {
        name: "last_name",
        title: "Last Name",
        type: "text",
        required: false,
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: false,
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
      },
      {
        name: "access",
        placeholder: "Has access to login",
        type: "checkbox",
        required: false,
      },
    ];

    return (
      <PaperDialog
        styles={{
          contentStyle: {
            padding: "36px",
            gap: "16px",
          },
        }}
        closable
        position="left"
        width="70vw"
      >
        <PaperDialog.Trigger>Trigger</PaperDialog.Trigger>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            Add New Employee
          </h2>
          <p style={{ fontSize: "14px", color: "#4B5563" }}>
            Fill out the information below to add a new employee to your team.
          </p>
        </div>

        <div
          style={{
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <StatefulForm
            fields={EMPLOYEE_FIELDS}
            formValues={value}
            validationSchema={employeeSchema}
            onValidityChange={setIsFormValid}
            onChange={({ currentState }) =>
              setValue((prev) => ({ ...prev, ...currentState }))
            }
            mode="onChange"
          />

          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              disabled={!isFormValid}
              styles={{
                self: {
                  width: "100%",
                  cursor: "pointer",
                  maxWidth: "180px",
                },
              }}
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>
      </PaperDialog>
    );
  },
};

export const Nested: Story = {
  render: () => {
    type Gender = "Male" | "Female";
    type Status = "Active" | "Inactive";

    interface FamilyMember {
      name: string;
      status: Status;
      gender: Gender;
      birthday: string;
    }

    interface Employee {
      name: string;
      status: Status;
      gender: Gender;
      birthday: string;
      familyRegistry: FamilyMember[];
    }

    const dialogRef1 = useRef<PaperDialogRef>(null);
    const dialogRef2 = useRef<PaperDialogRef>(null);

    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const columns: TableColumn[] = [
      {
        id: "name",
        caption: "Name",
      },
      {
        id: "status",
        caption: "Status",
      },
      {
        id: "gender",
        caption: "Gender",
      },
      {
        id: "birthday",
        caption: "Birthday",
      },
    ];

    const FIRST_NAMES = [
      "Amira",
      "Tono",
      "Rizky",
      "Siti",
      "Andi",
      "Putri",
      "Dimas",
      "Rina",
      "Fajar",
      "Nina",
      "Agus",
      "Lina",
      "Bagus",
      "Dewi",
      "Hendra",
      "Wulan",
      "Farhan",
      "Ayu",
      "Rafi",
      "Nabila",
    ];

    const generateFamily = (lastName: string): Employee["familyRegistry"] => {
      return Array.from({ length: 20 }, (_, i) => {
        const firstName = FIRST_NAMES[i % FIRST_NAMES.length];

        return {
          name: `${lastName} ${firstName}`,
          status: i % 3 === 0 ? "Inactive" : "Active",
          gender: i % 2 === 0 ? "Male" : "Female",
          birthday: `200${i % 10}-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
        };
      });
    };

    const EMPLOYEE_DATA: Employee[] = [
      {
        name: "Adam Hakarsa",
        status: "Active",
        gender: "Male",
        birthday: "2000-03-12",
        familyRegistry: generateFamily("Hakarsa"),
      },
      {
        name: "Mohamad Naufal Alim",
        status: "Active",
        gender: "Male",
        birthday: "2005-07-21",
        familyRegistry: generateFamily("Alim"),
      },
      {
        name: "Aisha Rahman",
        status: "Active",
        gender: "Female",
        birthday: "2000-11-05",
        familyRegistry: generateFamily("Rahman"),
      },
      {
        name: "Budi Santoso",
        status: "Inactive",
        gender: "Male",
        birthday: "2002-09-16",
        familyRegistry: generateFamily("Santoso"),
      },
    ];

    const [rows] = useState<Employee[]>(EMPLOYEE_DATA);
    const [familyRows, setFamilyRows] = useState<Employee>(null);
    const [search, setSearch] = useState("");
    const [familySearch, setFamilySearch] = useState("");

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
    };

    const ROW_ACTIONS = (
      rowId: string,
      withOnClick?: boolean
    ): TableSubMenuList[] => {
      const name = rowId.split("-")[0];
      const dataFamily = rows.find((props) => props.name === name);
      return [
        {
          caption: "Edit",
          icon: {
            image: RiEdit2Line,
            color: "gray",
          },
          onClick: async () => {
            if (withOnClick) {
              await setFamilyRows(dataFamily);
              await dialogRef1.current.openDialog();
            }
          },
        },
        {
          caption: "Delete",
          icon: {
            image: RiDeleteBin2Line,
          },
        },
      ];
    };

    const filteredRows = useMemo(() => {
      return rows.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.status.toLowerCase().includes(search.toLowerCase()) ||
          item.gender.toLowerCase().includes(search.toLowerCase()) ||
          item.birthday.toLowerCase().includes(search.toLowerCase())
      );
    }, [rows, search]);

    const filteredFamilyRows = useMemo(() => {
      return familyRows?.familyRegistry.filter(
        (props) =>
          props.name.toLowerCase().includes(familySearch.toLowerCase()) ||
          props.status.toLowerCase().includes(familySearch.toLowerCase()) ||
          props.gender.toLowerCase().includes(familySearch.toLowerCase()) ||
          props.birthday.toLowerCase().includes(familySearch.toLowerCase())
      );
    }, [familyRows, familySearch]);

    return (
      <Fragment>
        <Card
          title="Employee"
          subtitle="Overview of all employee and their key personel"
          styles={{
            containerStyle: css`
              padding-left: 0px;
              padding-right: 0px;
              min-width: 1000px;
              padding-bottom: 0px;
            `,
            headerStyle: css`
              padding-left: 15px;
              padding-right: 15px;
              border-bottom: 1px solid #d1d5db;
            `,
          }}
        >
          <Table
            searchable
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
            searchbox={{ onChange: (e) => setSearch(e.target.value) }}
            columns={columns}
          >
            {filteredRows.map((rowValue, rowIndex) => (
              <Table.Row
                key={rowIndex}
                rowId={`${rowValue.name}-${rowValue.status}-${rowValue.gender}-${rowValue.birthday}`}
                actions={(columnCaption) => ROW_ACTIONS(columnCaption, true)}
                content={[
                  rowValue.name,
                  rowValue.status,
                  rowValue.gender,
                  rowValue.birthday,
                ]}
              />
            ))}
          </Table>
        </Card>

        <PaperDialog
          ref={dialogRef1}
          styles={{
            contentStyle: css`
              gap: 24px;
              overflow: auto;
            `,
          }}
          closable
          width="90vw"
        >
          <Card
            title="Family Registry"
            subtitle="Detailed view of employees and their family registry records"
            styles={{
              containerStyle: css`
                padding: 0px;
                width: 100%;
              `,
              headerStyle: css`
                border-bottom: 1px solid #d1d5db;
              `,
            }}
          >
            <Table
              searchable
              actions={[
                {
                  caption: "Add Family",
                  icon: {
                    image: RiAddBoxLine,
                  },
                  onClick: async () => {
                    await dialogRef2.current.openDialog();
                  },
                },
              ]}
              searchbox={{ onChange: (e) => setFamilySearch(e.target.value) }}
              columns={columns}
              onItemsSelected={handleItemsSelected}
            >
              {filteredFamilyRows?.map((rowValue, rowIndex) => (
                <Table.Row
                  key={rowIndex}
                  actions={ROW_ACTIONS}
                  rowId={`${rowValue.name}-${rowValue.status}-${rowValue.gender}-${rowValue.birthday}`}
                  content={[
                    rowValue.name,
                    rowValue.status,
                    rowValue.gender,
                    rowValue.birthday,
                  ]}
                />
              ))}
            </Table>
          </Card>
        </PaperDialog>

        <PaperDialog
          ref={dialogRef2}
          closable
          width="75vw"
          styles={{
            contentStyle: css`
              padding: 36px;
              gap: 24px;
            `,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h3>Nested</h3>
          </div>
        </PaperDialog>
      </Fragment>
    );
  },
};
