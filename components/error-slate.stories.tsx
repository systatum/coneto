import { Meta, StoryObj } from "@storybook/react";
import { ErrorSlate } from "./error-slate";

const meta: Meta<typeof ErrorSlate> = {
  title: "Content/ErrorSlate",
  component: ErrorSlate,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ErrorSlate is a visually engaging component to display HTTP error codes in a 3D rotating cube format, with optional title and additional content. It’s perfect for error pages, dashboards, or empty states that need an interactive and memorable UI.

---

### ✨ Features
- 🔢 **HTTP error codes**: Supports common HTTP status codes (400, 401, 403, 404, 500, etc.).
- 🧊 **3D rotating cube**: Each digit of the error code is displayed on a cube face, creating a dynamic, animated effect.
- 🖋️ **Custom titles**: Optional descriptive title below the cube.
- 🧩 **Additional content**: Optional children prop to add messages, actions, or guidance below the title.
- 🎨 **Customizable styles**: Override title typography and cube face appearance via the \`styles\` prop.

---

### 📌 Usage
\`\`\`tsx
<ErrorSlate
  code="404"
  title="Page Not Found"
  children={
    <div>
      <p>Sorry, the page you are looking for does not exist.</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  }
  styles={{
    titleStyle: css\`
      font-size: 3rem;
      color: #333;
    \`,
    cubeFaceStyle: css\`
      background-color: #ff4d4f;
      border-color: #d9363e;
      font-size: 2rem;
    \`,
  }}
/>
\`\`\`

- Use \`code\` to display the HTTP error number on the animated cube.
- Titles and children provide additional context or actions.
- Customize appearance using \`styles.titleStyle\` and \`styles.cubeFaceStyle\`.
- Works with any valid ReactNode in the \`children\` prop for messages, buttons, or links.

`,
      },
    },
  },
  argTypes: {
    code: {
      control: {
        type: "select",
        options: ErrorSlate["code"],
      },
      description: "The 3-digit HTTP error code to render on the cube faces.",
      defaultValue: "404",
    },
    title: {
      control: "text",
      description: "Optional title displayed below the cube.",
    },
    children: {
      control: false,
      description:
        "Optional ReactNode to render below the title (e.g. message, actions).",
    },
    styles: {
      control: false,
      description:
        "- `titleStyle`: Custom CSS for the error title text (typography, color, spacing).\n" +
        "- `cubeFaceStyle`: Custom CSS for each cube face (background, border, color, font styles, visual effects). Does not affect layout or 3D transforms.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorSlate>;

export const Default: Story = {
  args: {
    code: "404",
    title: "PageNotFound",
    children: (
      <div
        style={{
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        We couldn't find the page you were looking for. Try searching or&nbsp;
        <a
          href="/"
          style={{
            textDecoration: "underline",
          }}
        >
          return to the homepage
        </a>
      </div>
    ),
  },
  render: (args) => {
    return <ErrorSlate {...args} />;
  },
};

export const CustomColor: Story = {
  args: {
    code: "403",
    title: "AccessDenied",
    styles: {
      cubeFaceStyle: {
        background: "gold",
        borderColor: "black",
        color: "black",
      },
    },
    children: (
      <div
        style={{
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        You don't have permission to view this page. Please contact the
        administrator or&nbsp;
        <a
          href="/"
          style={{
            textDecoration: "underline",
          }}
        >
          return to the homepage
        </a>
      </div>
    ),
  },
  render: (args) => {
    return <ErrorSlate {...args} />;
  },
};
