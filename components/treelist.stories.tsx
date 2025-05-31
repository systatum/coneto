import { Meta, StoryObj } from "@storybook/react";
import { TreeList } from "./treelist";
import { ChangeEvent, useMemo, useState } from "react";
import Searchbox from "./searchbox";

const meta: Meta<typeof TreeList> = {
  title: "Content/TreeList",
  component: TreeList,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TreeList>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState({
      label: "",
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

    const setPerson = (item: { id: number; label: string }) => {
      console.log("Clicked person:", item.label);
    };

    const DATA_TREE_LIST = [
      {
        label: "Member of Technical Staff",
        items: [
          { id: 1, label: "Adam Noto Hakarsa", onClick: setPerson },
          { id: 2, label: "Mohamad Naufal Alim", onClick: setPerson },
        ],
      },
      {
        label: "Product Management Team",
        items: [
          { id: 1, label: "Samantha Lee", onClick: setPerson },
          { id: 2, label: "Jason Kim", onClick: setPerson },
          { id: 3, label: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    const FILTERED_CONTENT = useMemo(() => {
      if (DATA_TREE_LIST.length === 0) return [];

      return DATA_TREE_LIST.map((data) => ({
        ...data,
        items: data.items.filter((val) =>
          val.label.toLowerCase().includes(value.label.toLowerCase())
        ),
      })).filter((data) => data.items.length > 0);
    }, [DATA_TREE_LIST, value]);

    return (
      <div className="flex flex-col gap-1 max-w-[250px]">
        <Searchbox name="label" value={value.label} onChange={onChangeValue} />
        <TreeList
          content={FILTERED_CONTENT}
          empty={<div className="text-sm font-semibold">Not found.</div>}
          searchTerm={value.label}
        />
      </div>
    );
  },
};
