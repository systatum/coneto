import { Meta, StoryObj } from "@storybook/react/*";
import { Toast } from "./toast";
import { Button } from "./button";
import { LoadingSpinner } from "./loading-spinner";
import { css } from "styled-components";
import { generateSentence } from "./../lib/text";

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

export const WithActions: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Section title="Two actions">
        <Row>
          <Button
            onClick={() =>
              Toast.warning({
                title: "Appointment Update",
                content:
                  "Your hospital appointment has been rescheduled due to doctor availability changes.",
                actions: [
                  { label: "View details" },
                  { label: "Confirm change" },
                ],
              })
            }
          >
            Hospital Update
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
    </div>
  ),
};

export const WithDetailSlot: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Section title="With detail slot">
        <Row>
          <Button
            variant="secondary"
            onClick={() =>
              Toast.warning({
                title: "Export pending",
                disappearAfterMs: 0,
                content:
                  "Preparing your export. Download will be available shortly.",
                detailSlot: (
                  <div>
                    <p style={{ margin: 0 }}>
                      {generateSentence({ minLen: 60, maxLen: 110, seed: 101 })}
                    </p>
                  </div>
                ),
                actions: [
                  { label: "Download", disabled: true },
                  { label: "Dismiss", onClick: () => console.log("dismiss") },
                ],
              })
            }
          >
            Show Export Toast
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

export const Loading: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() => {
        Toast.neutral({
          content: "Fetching data...",
          icon: {
            render: <LoadingSpinner iconSize={24} />,
            position: "center-center",
          },
          styles: {
            iconStyle: css`
              background-color: transparent;
            `,
            contentStyle: css`
              font-weight: 600;
              font-size: 16px;
              font-family: monospace;
            `,
          },
          position: "center-center",
          width: 200,
          closable: false,
          disappearAfterMs: 1000,
        });
      }}
    >
      Loading
    </Button>
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
