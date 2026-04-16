import { Meta, StoryObj } from "@storybook/react";
import { Keynote } from "./keynote";
import { generateSentence } from "./../lib/text";
import { useTheme } from "./../theme";

const meta: Meta<typeof Keynote> = {
  title: "Content/Keynote",
  component: Keynote,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Keynote displays key-value pairs in a clean, structured layout with data sourced from an object/dictionary. You may customize the renderer for a given field/key.

---

### ✨ Features
- 🗝 **Automatic key-value rendering**: Display selected keys and labels from a data object.
- 🎨 **Custom rendering**: Supports \`ReactNode\` values and per-key formatters for flexible rendering (e.g., bold text, currency formatting, or custom JSX).
- 🖌 **Styling flexibility**: Customize the wrapper, rows, keys, and values via \`styles\` prop.

---

### 📌 Usage

\`\`\`tsx
<Keynote
  data={{ name: "Budi Siahaan", role: "Frontend Engineer", salary: <b>80000 $</b> }}
  keys={["name", "role", "salary"]}
  keyLabels={["Full Name", "Position", "Monthly Salary"]}
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
      execPath:
        "/home/alim.naufal@systatum.local/Documents/works/mydb-studio-system/winamp/node_modules/.pnpm/electron@40.1.0/node_modules/electron/dist/electron,--no-sandbox,dist-electron/electron/main.js",
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
          "execPath",
        ]}
        keyLabels={[
          "Model Type",
          "Request Created By",
          "Last Synced",
          "Created On",
          "Description",
          "Execution Path",
        ]}
      />
    );
  },
};

export const CustomRendering: Story = {
  render: () => {
    const { currentTheme } = useTheme();
    const buttonTheme = currentTheme?.button;

    const data = {
      modelType: "MXQ83700F3",
      requestCreatedBy: (
        <div
          onClick={() => console.log("Email was sent")}
          style={{
            fontWeight: 500,
            cursor: "pointer",
            color: buttonTheme?.link?.textColor,
          }}
        >
          alim@systatum.com
        </div>
      ),
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
      />
    );
  },
};
