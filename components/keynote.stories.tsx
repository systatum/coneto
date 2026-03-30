import { Meta, StoryObj } from "@storybook/react";
import { Keynote } from "./keynote";
import { generateSentence } from "./../lib/text";

const meta: Meta<typeof Keynote> = {
  title: "Content/Keynote",
  component: Keynote,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Keynote is a flexible component for displaying key-value pairs in a clean, structured layout. 
It supports rendering data from an object, custom renderers per key, manual children, and fully customizable styles.

---

### ✨ Features
- 🗝 **Automatic key-value rendering**: Display selected keys and labels from a data object.
- 🎨 **Custom rendering**: Provide a \`renderer\` function per key for formatting (e.g., bold numbers, currency formatting, JSX content).
- 📦 **Children support**: Render any custom JSX as a child if no \`data\` is provided.
- 🖌 **Styling flexibility**: Customize the wrapper, rows, keys, and values via \`styles\` prop.
- 🔧 **Composability**: Each row is a \`Keynote.Point\` that can be used independently for nested or dynamic structures.

---

### 📌 Usage

\`\`\`tsx
<Keynote
  data={{ name: "Alim Naufal", role: "Frontend Developer", salary: 8500000 }}
  keys={["name", "role", "salary"]}
  keyLabels={["Full Name", "Position", "Monthly Salary"]}
  renderer={{
    salary: val => <b>{val.toLocaleString()} IDR</b>
  }}
  styles={{
    self: css\`margin-top: 16px;\`,
    rowStyle: css\`padding: 8px 0;\`,
    rowKeyStyle: css\`color: #2563eb;\`,
    rowValueStyle: css\`font-weight: 600;\`
  }}
/>

{/* Using children instead of data */}
<Keynote styles={{ self: css\`margin-top: 16px;\` }}>
  <Keynote.Point label="Custom Label">Custom Value</Keynote.Point>
  <Keynote.Point label="Another Label">Another Value</Keynote.Point>
</Keynote>
\`\`\`

- Use \`data\` + \`keys\` + \`keyLabels\` to render object values automatically.
- Use \`renderer\` for custom formatting or JSX output.
- Fully styleable using the \`styles\` prop.
- \`Keynote.Point\` can be used individually for custom rows.
`,
      },
    },
  },
  argTypes: {
    data: {
      control: "object",
      description: "The source object whose keys and values will be rendered.",
    },
    keys: {
      control: false,
      description: "Array of keys to display from the `data` object.",
    },
    keyLabels: {
      control: false,
      description: "Display labels corresponding to each key.",
    },
    renderer: {
      control: false,
      description:
        "Custom renderers for specific keys. Example: `{ amount: val => <b>{val}</b> }`",
    },
    children: {
      control: false,
      description:
        "Optional children (used if no data/keys/keyLabels are provided).",
    },
    styles: {
      control: false,
      description: `
Custom styles for the Keynote component. This object allows you to override styles for different parts of the component.

- **self**: Styles applied to the root wrapper of the Keynote component (layout, spacing, positioning).
- **rowStyle**: Styles applied to each keynote row wrapper.
- **rowKeyStyle**: Styles applied to the label text inside each row.
- **rowValueStyle**: Styles applied to the value content inside each row.

Each field accepts a \`CSSProp\` (styled-components compatible) and allows full visual customization of the component.
`,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Keynote>;

export const Default: Story = {
  render: () => {
    const data = {
      modelType: "MXQ83700F3",
      requestCreatedBy: "adam@systatum.com",
      lastSynced: "2025-06-20",
      createdOn: "2025-06-19",
      desc: "Backup unit installed on site",
    };

    return (
      <Keynote
        data={data}
        keys={[
          "modelType",
          "requestCreatedBy",
          "lastSynced",
          "createdOn",
          "desc",
        ]}
        keyLabels={[
          "Model Type",
          "Request Created By",
          "Last Synced",
          "Created On",
          "Description",
        ]}
      />
    );
  },
};

export const CustomRendering: Story = {
  render: () => {
    const data = {
      modelType: "MXQ83700F3",
      requestCreatedBy: "alim@systatum.com",
      lastSynced: "2025-06-20",
      createdOn: "2025-06-19",
      desc: generateSentence({
        minLen: 100,
        maxLen: 140,
      }),
    };

    return (
      <Keynote
        data={data}
        keys={[
          "modelType",
          "requestCreatedBy",
          "lastSynced",
          "createdOn",
          "desc",
        ]}
        keyLabels={[
          "Model Type",
          "Request Created By",
          "Last Synced",
          "Created On",
          "Description",
        ]}
        renderer={{
          requestCreatedBy: (value) => (
            <div
              onClick={() => console.log("Email was sent")}
              style={{
                fontWeight: 500,
                cursor: "pointer",
                color: "#3b82f6",
              }}
            >
              {value}
            </div>
          ),
        }}
      />
    );
  },
};
