import { Meta, StoryObj } from "@storybook/react/*";
import { Toast } from "./toast";
import { Button } from "./button";

const meta: Meta<typeof Toast> = {
  title: "Content/Toast",
  component: Toast.alert,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Toast is a component that displays a brief message to the user. It is typically used to provide feedback on an action or to display a notification. Toasts are usually displayed for a short period of time and then automatically dismissed.`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Section title="Variant — title + content">
        <Row>
          <Button
            variant="primary"
            onClick={() =>
              Toast.primary({
                title: "Information",
                content: "This is a primary toast message.",
              })
            }
          >
            Primary
          </Button>
          <Button
            variant="success"
            onClick={() =>
              Toast.success({
                title: "Saved successfully",
                content: "Your changes have been saved.",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              Toast.danger({
                title: "Something went wrong",
                content: "Please try again or contact support.",
              })
            }
          >
            Danger
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              Toast.warning({
                title: "Heads up",
                content: "You're approaching your storage limit.",
              })
            }
          >
            Warning
          </Button>
          <Button
            onClick={() =>
              Toast.neutral({
                title: "Just so you know",
                content: "A neutral notification with no urgency.",
              })
            }
          >
            Neutral
          </Button>
        </Row>
      </Section>

      <Section title="Variant — content only (no title)">
        <Row>
          <Button
            variant="primary"
            onClick={() =>
              Toast.primary({ content: "Primary — content only." })
            }
          >
            Primary
          </Button>
          <Button
            variant="success"
            onClick={() =>
              Toast.success({ content: "Success — content only." })
            }
          >
            Success
          </Button>
          <Button
            variant="danger"
            onClick={() => Toast.danger({ content: "Danger — content only." })}
          >
            Danger
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              Toast.warning({ content: "Warning — content only." })
            }
          >
            Warning
          </Button>
          <Button
            onClick={() =>
              Toast.neutral({ content: "Neutral — content only." })
            }
          >
            Neutral
          </Button>
        </Row>
      </Section>

      <Section title="Variant — persistent (no auto-dismiss)">
        <Row>
          <Button
            variant="primary"
            onClick={() =>
              Toast.primary({
                title: "Information",
                content: "Will not auto-dismiss. Close manually.",
                disappearAfterMs: 0,
              })
            }
          >
            Primary
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              Toast.danger({
                title: "Critical error",
                content: "Will not auto-dismiss. Close manually.",
                disappearAfterMs: 0,
              })
            }
          >
            Danger
          </Button>
        </Row>
      </Section>

      <Section title="Variant — not closable">
        <Row>
          <Button
            variant="success"
            onClick={() =>
              Toast.success({
                title: "Processing…",
                content: "This toast cannot be closed manually.",
                closable: false,
                disappearAfterMs: 3000,
              })
            }
          >
            Success (no close btn)
          </Button>
        </Row>
      </Section>
    </div>
  ),
};

export const WithActionsAndDetail: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Section title="Single action">
        <Row>
          <Button
            variant="success"
            onClick={() =>
              Toast.success({
                title: "File uploaded",
                content: "report.pdf was uploaded successfully.",
                actions: [
                  { label: "View file", onClick: () => alert("Opening file…") },
                ],
              })
            }
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              Toast.warning({
                title: "Session expiring",
                content: "Your session will expire in 2 minutes.",
                icon: {
                  position: "left-center",
                },
                actions: [
                  {
                    label: "Stay logged in",
                    onClick: () => alert("Session extended"),
                  },
                ],
              })
            }
          >
            Warning
          </Button>
        </Row>
      </Section>

      <Section title="Two actions">
        <Row>
          <Button
            variant="danger"
            onClick={() =>
              Toast.danger({
                title: "Delete this item?",
                content: "This action cannot be undone.",
                disappearAfterMs: 0,
                actions: [
                  {
                    label: "Delete",
                    variant: "danger",
                    onClick: () => alert("Deleted!"),
                  },
                  { label: "Cancel" },
                ],
              })
            }
          >
            Danger
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              Toast.primary({
                title: "Update available",
                content: "v2.4.0 is ready to install.",
                actions: [
                  { label: "Install now", onClick: () => alert("Installing…") },
                  { label: "Later" },
                ],
              })
            }
          >
            Primary
          </Button>
          <Button
            onClick={() =>
              Toast.neutral({
                title: "Cookie preferences",
                content: "We use cookies to improve your experience.",
                disappearAfterMs: 0,
                actions: [
                  { label: "Accept all", onClick: () => alert("Accepted") },
                  { label: "Reject all" },
                ],
              })
            }
          >
            Neutral
          </Button>
        </Row>
      </Section>

      <Section title="With disabled action">
        <Row>
          <Button
            variant="secondary"
            onClick={() =>
              Toast.warning({
                title: "Export pending",
                content:
                  "Preparing your export. Download will be available shortly.",
                actions: [
                  { label: "Download", disabled: true },
                  { label: "Dismiss" },
                ],
              })
            }
          >
            Action disabled
          </Button>
        </Row>
      </Section>

      <Section title="With detail slot">
        <Row>
          <Button
            variant="primary"
            onClick={() =>
              Toast.primary({
                title: "Update available",
                content: "v2.4.0 is ready to install.",
                disappearAfterMs: 7000,
                detailSlot: (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6366f1",
                      background: "#e0e7ff",
                      borderRadius: 6,
                      padding: "6px 10px",
                    }}
                  >
                    Includes 3 bug fixes and performance improvements.
                  </div>
                ),
                actions: [
                  { label: "Install now", onClick: () => alert("Installing…") },
                  { label: "Later" },
                ],
              })
            }
          >
            Primary
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              Toast.danger({
                title: "Build failed",
                content: "ci/deploy-production failed with exit code 1.",
                disappearAfterMs: 0,
                detailSlot: (
                  <pre
                    style={{
                      fontSize: 11,
                      background: "#fcb8bc",
                      color: "#881337",
                      borderRadius: 6,
                      margin: 0,
                      padding: "14px",
                      overflowX: "auto",
                    }}
                  >
                    "Error: ENOENT: no such file or directory\n at deploy.js:42"
                  </pre>
                ),
                actions: [
                  { label: "View logs", onClick: () => alert("Opening logs…") },
                  { label: "Retry", onClick: () => alert("Retrying…") },
                ],
              })
            }
          >
            Danger + detail
          </Button>
          <Button
            variant="success"
            onClick={() =>
              Toast.success({
                title: "Payment received",
                content: "Invoice #1042 has been paid.",
                detailSlot: (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#14532d",
                      background: "#dcfce7",
                      borderRadius: 6,
                      padding: "6px 10px",
                    }}
                  >
                    Amount: <strong>$240.00</strong> · Ref: TXN-88291
                  </div>
                ),
                actions: [
                  {
                    label: "View receipt",
                    onClick: () => alert("Opening receipt…"),
                  },
                ],
              })
            }
          >
            Success + detail
          </Button>
        </Row>
      </Section>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Section title="All positions">
        <Row>
          {(
            [
              "top-left",
              "top-center",
              "top-right",
              "bottom-left",
              "bottom-center",
              "bottom-right",
              "center-center",
            ] as const
          ).map((position) => (
            <Button
              key={position}
              onClick={() =>
                Toast.neutral({
                  content: `Position: ${position}`,
                  position,
                  disappearAfterMs: 2500,
                  closable: false,
                })
              }
            >
              {position}
            </Button>
          ))}
        </Row>
      </Section>

      <Section title="Stack multiple at same position">
        <Row>
          <Button
            variant="success"
            onClick={() => {
              Toast.success({ content: "First toast", position: "top-right" });
              setTimeout(
                () =>
                  Toast.warning({
                    content: "Second toast",
                    position: "top-right",
                  }),
                150
              );
              setTimeout(
                () =>
                  Toast.danger({
                    content: "Third toast",
                    position: "top-right",
                  }),
                300
              );
            }}
          >
            Stack at top-right
          </Button>
          <Button
            variant="success"
            onClick={() => {
              Toast.primary({
                content: "First toast",
                position: "bottom-left",
              });
              setTimeout(
                () =>
                  Toast.neutral({
                    content: "Second toast",
                    position: "bottom-left",
                  }),
                150
              );
              setTimeout(
                () =>
                  Toast.success({
                    content: "Third toast",
                    position: "bottom-left",
                  }),
                300
              );
            }}
          >
            Stack at bottom-left
          </Button>
        </Row>
      </Section>

      <Section title="Dismiss all">
        <Row>
          <Button variant="danger" onClick={() => Toast.closeAll()}>
            Close all toasts
          </Button>
        </Row>
      </Section>
    </div>
  ),
};

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{children}</div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#94a3b8",
          marginBottom: 10,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
