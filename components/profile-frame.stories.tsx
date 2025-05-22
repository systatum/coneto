import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import ProfileFrame from "./profile-frame";
import { ProfileFrameProps } from "@/type/profile-frame";

const meta: Meta<typeof ProfileFrame> = {
  title: "Components Reusable/Profile Frame",
  component: ProfileFrame,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    firstName: {
      control: "text",
      description: "First name of the profile",
    },
    lastName: {
      control: "text",
      description: "Last name of the profile",
    },
    profileImageUrl: {
      control: "text",
      description: "Image of the profile",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProfileFrame>;

export const ProfileWithoutImage: Story = {
  args: {
    firstName: "John",
    lastName: "",
    changeable: true,
  },
  render: (args: ProfileFrameProps) => {
    return <ProfileFrame {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameElement = await canvas.findByText("JO");
    await expect(nameElement).toBeVisible();
  },
};

export const ProfileWithImage: Story = {
  args: {
    firstName: "John",
    lastName: "Doe",
    changeable: true,
    profileImageUrl: "/avatar-1.jpg",
    onChange: () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();
      input.onchange = () => {
        const file = input.files?.[0];
        if (file) {
          console.log("Selected file:", file.name);
        }
      };
    },
  },
  render: (args: ProfileFrameProps) => {
    return <ProfileFrame {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const image = await canvas.findByRole("img", {
      name: /John Doe profile image on the Systatum superapp/i,
    });
    await expect(image).toBeVisible();
  },
};
