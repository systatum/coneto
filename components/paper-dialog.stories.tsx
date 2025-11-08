import { Meta, StoryObj } from "@storybook/react";
import { PaperDialog, PaperDialogRef } from "./paper-dialog";
import { Button } from "./button";
import { StatefulForm, FormFieldProps } from "./stateful-form";
import { Fragment, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { COUNTRY_CODES } from "./../constants/countries";
import { css } from "styled-components";
import { Card } from "./card";
import { ColumnTableProps, SubMenuListTableProps, Table } from "./table";
import {
  RiAddBoxLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiEdit2Line,
  RiRefreshLine,
} from "@remixicon/react";

const meta: Meta<typeof PaperDialog> = {
  title: "Stage/PaperDialog",
  component: PaperDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
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
        title: "Has access to login",
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
        <PaperDialog ref={dialogRef}>
          <PaperDialog.Content
            style={{
              padding: "36px",
              gap: "24px",
            }}
          >
            <Button onClick={() => dialogRef.current?.minimizedDialog()}>
              Minimize here.
            </Button>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
                Add New Employee
              </h2>
              <p style={{ fontSize: "14px", color: "#4B5563" }}>
                Fill out the information below to add a new employee to your
                team.
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
                  buttonStyle={{
                    width: "100%",
                    cursor: "pointer",
                    maxWidth: "180px",
                  }}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </PaperDialog.Content>
        </PaperDialog>
      </div>
    );
  },
};

export const Closable: Story = {
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
        title: "Has access to login",
        type: "checkbox",
        required: false,
      },
    ];

    return (
      <PaperDialog closable>
        <PaperDialog.Trigger>Trigger</PaperDialog.Trigger>
        <PaperDialog.Content
          style={{
            padding: "36px",
            gap: "24px",
          }}
        >
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
                buttonStyle={{
                  width: "100%",
                  cursor: "pointer",
                  maxWidth: "180px",
                }}
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </PaperDialog.Content>
      </PaperDialog>
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
        title: "Has access to login",
        type: "checkbox",
        required: false,
      },
    ];

    return (
      <PaperDialog closable position="left" width="70vw">
        <PaperDialog.Trigger>Trigger</PaperDialog.Trigger>
        <PaperDialog.Content
          style={{
            padding: "36px",
            gap: "24px",
          }}
        >
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
                buttonStyle={{
                  width: "100%",
                  cursor: "pointer",
                  maxWidth: "180px",
                }}
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </PaperDialog.Content>
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

    const columns: ColumnTableProps[] = [
      {
        caption: "Name",
      },
      {
        caption: "Status",
      },
      {
        caption: "Gender",
      },
      {
        caption: "Birthday",
      },
    ];

    const EMPLOYEE_DATA: Employee[] = [
      {
        name: "Adam Hakarsa",
        status: "Active",
        gender: "Male",
        birthday: "2000-03-12",
        familyRegistry: [
          {
            name: "Hana Hakarsa",
            status: "Active",
            gender: "Female",
            birthday: "2002-05-21",
          },
          {
            name: "Dimas Hakarsa",
            status: "Active",
            gender: "Male",
            birthday: "2004-10-11",
          },
        ],
      },
      {
        name: "Mohamad Naufal Alim",
        status: "Active",
        gender: "Male",
        birthday: "2005-07-21",
        familyRegistry: [
          {
            name: "Amira Alim",
            status: "Active",
            gender: "Female",
            birthday: "2008-03-04",
          },
          {
            name: "Tono Alim",
            status: "Inactive",
            gender: "Male",
            birthday: "2010-12-25",
          },
        ],
      },
      {
        name: "Aisha Rahman",
        status: "Active",
        gender: "Female",
        birthday: "2000-11-05",
        familyRegistry: [
          {
            name: "Siti Rahman",
            status: "Active",
            gender: "Female",
            birthday: "2003-06-11",
          },
          {
            name: "Amir Rahman",
            status: "Inactive",
            gender: "Male",
            birthday: "2006-08-30",
          },
        ],
      },
      {
        name: "Budi Santoso",
        status: "Inactive",
        gender: "Male",
        birthday: "2002-09-16",
        familyRegistry: [
          {
            name: "Rina Santoso",
            status: "Active",
            gender: "Female",
            birthday: "2005-02-12",
          },
          {
            name: "Andi Santoso",
            status: "Active",
            gender: "Male",
            birthday: "2008-10-01",
          },
        ],
      },
    ];

    const [rows] = useState<Employee[]>(EMPLOYEE_DATA);
    const [familyRows, setFamilyRows] = useState<Employee>(null);
    const [search, setSearch] = useState("");
    const [familySearch, setFamilySearch] = useState("");

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
    };

    const ROW_ACTION = (rowId: string): SubMenuListTableProps[] => {
      const name = rowId.split("-")[0];
      const dataFamily = rows.find((props) => props.name === name);
      return [
        {
          caption: "Edit",
          icon: RiEdit2Line,
          iconColor: "gray",
          onClick: async () => {
            await setFamilyRows(dataFamily);
            await dialogRef1.current.openDialog();
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
          containerStyle={css`
            padding-left: 0px;
            padding-right: 0px;
            min-width: 1000px;
            padding-bottom: 0px;
          `}
          headerStyle={css`
            padding-left: 15px;
            padding-right: 15px;
            border-bottom: 1px solid #d1d5db;
          `}
        >
          <Table
            searchable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            onSearchboxChange={(e) => setSearch(e.target.value)}
            columns={columns}
          >
            {filteredRows.map((rowValue, rowIndex) => (
              <Table.Row
                key={rowIndex}
                rowId={`${rowValue.name}-${rowValue.status}-${rowValue.gender}-${rowValue.birthday}`}
                actions={ROW_ACTION}
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

        <PaperDialog ref={dialogRef1} closable width="90vw">
          <PaperDialog.Content
            style={css`
              padding: 36px;
              padding-left: 20px;
              gap: 24px;
              overflow: auto;
            `}
          >
            <Card
              title="Family Registry"
              subtitle="Detailed view of employees and their family registry records"
              containerStyle={css`
                padding-left: 0px;
                padding-right: 0px;
                min-width: 1000px;
                padding-bottom: 0px;
              `}
              headerStyle={css`
                padding-left: 15px;
                padding-right: 15px;
                border-bottom: 1px solid #d1d5db;
              `}
            >
              <Table
                searchable
                tableRowContainerStyle={css`
                  max-height: 400px;
                `}
                actions={[
                  {
                    title: "Add Family",
                    icon: RiAddBoxLine,
                    onClick: async () => {
                      await dialogRef2.current.openDialog();
                    },
                  },
                ]}
                onSearchboxChange={(e) => setFamilySearch(e.target.value)}
                columns={columns}
                onItemsSelected={handleItemsSelected}
              >
                {filteredFamilyRows?.map((rowValue, rowIndex) => (
                  <Table.Row
                    key={rowIndex}
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
          </PaperDialog.Content>
        </PaperDialog>

        <PaperDialog ref={dialogRef2} closable width="75vw">
          <PaperDialog.Content
            style={{
              padding: "36px",
              gap: "24px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <h3>Nested</h3>
            </div>
          </PaperDialog.Content>
        </PaperDialog>
      </Fragment>
    );
  },
};
