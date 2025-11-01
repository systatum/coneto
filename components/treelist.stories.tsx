import { Meta, StoryObj } from "@storybook/react";
import {
  TreeList,
  TreeListActionsProps,
  TreeListContentProps,
  TreeListItemsProps,
} from "./treelist";
import { RiAtLine, RiSearchLine } from "@remixicon/react";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";
import { css } from "styled-components";

const meta: Meta<typeof TreeList> = {
  title: "Content/TreeList",
  component: TreeList,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TreeList>;

export const Default: Story = {
  render: () => {
    const setPerson = (item: TreeListItemsProps) => {
      console.log("Clicked person:", item.title);
    };

    const TREE_LIST_DATA: TreeListContentProps[] = [
      {
        title: "Member of Technical Staff",
        collapsible: true,
        items: [
          { id: "mts-1", title: "Adam Noto Hakarsa", onClick: setPerson },
          { id: "mts-2", title: "Mohamad Naufal Alim", onClick: setPerson },
        ],
      },
      {
        title: "Product Management Team",
        collapsible: true,
        items: [
          { id: "pmt-1", title: "Samantha Lee", onClick: setPerson },
          { id: "pmt-2", title: "Jason Kim", onClick: setPerson },
          { id: "pmt-3", title: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxWidth: "250px",
        }}
      >
        <TreeList content={TREE_LIST_DATA} emptySlate={<p>Not found.</p>} />
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const setPerson = (item: TreeListItemsProps) => {
      console.log("Clicked person:", item.title);
    };

    const TREE_LIST_DATA: TreeListContentProps[] = [
      {
        title: "Member of Technical Staff",
        items: [
          { id: "mts-1", title: "Adam Noto Hakarsa", onClick: setPerson },
          { id: "mts-2", title: "Mohamad Naufal Alim", onClick: setPerson },
        ],
      },
      {
        title: "Product Management Team",
        items: [
          { id: "pmt-1", title: "Samantha Lee", onClick: setPerson },
          { id: "pmt-2", title: "Jason Kim", onClick: setPerson },
          { id: "pmt-3", title: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    const TREE_LIST_ACTIONS: TreeListActionsProps[] = [
      {
        title: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: RiSearchLine,
      },
      {
        title: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxWidth: "250px",
        }}
      >
        <TreeList
          content={TREE_LIST_DATA}
          actions={TREE_LIST_ACTIONS}
          emptySlate={<p>Not found.</p>}
        />
      </div>
    );
  },
};

export const WithoutHeader: Story = {
  render: () => {
    const setPerson = (item: TreeListItemsProps) => {
      console.log("Clicked person:", item.title);
    };

    const TREE_LIST_DATA = [
      {
        items: [
          { id: "1", title: "Adam Noto Hakarsa", onClick: setPerson },
          { id: "2", title: "Mohamad Naufal Alim", onClick: setPerson },
          { id: "3", title: "Samantha Lee", onClick: setPerson },
          { id: "4", title: "Jason Kim", onClick: setPerson },
          { id: "5", title: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    const TREE_LIST_ACTIONS: TreeListActionsProps[] = [
      {
        title: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: RiSearchLine,
      },
      {
        title: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxWidth: "250px",
        }}
      >
        <TreeList
          content={TREE_LIST_DATA}
          actions={TREE_LIST_ACTIONS}
          emptySlate={<p>Not found.</p>}
        />
      </div>
    );
  },
};

export const WithEmptySlate: Story = {
  render: () => {
    const TREE_LIST_DATA: TreeListContentProps[] = [];

    const TREE_LIST_ACTIONS: TreeListActionsProps[] = [
      {
        title: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: RiSearchLine,
      },
      {
        title: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxWidth: "250px",
        }}
      >
        <TreeList
          content={TREE_LIST_DATA}
          actions={TREE_LIST_ACTIONS}
          emptySlate={
            <EmptySlate
              imageUrl="https://picsum.photos/200?random=1"
              title="Manage your inventory transfers"
              containerStyle={css`
                text-align: center;
                margin: auto;
              `}
              imageStyle={css`
                max-width: 200px;
              `}
              subtitle="Track and receive your incoming inventory from suppliers."
              actions={
                <>
                  <Button
                    variant="default"
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Add Item
                  </Button>
                  <Button
                    variant="primary"
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Learn More
                  </Button>
                </>
              }
            />
          }
        />
      </div>
    );
  },
};
