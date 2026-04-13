import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { Combobox } from "./combobox";
import { ReactNode, useEffect, useMemo, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { clamp } from "./../lib/math";
import { PaginationThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showNumbers?: boolean;
  styles?: PaginationStyles;
}

export interface PaginationStyles {
  containerStyle?: CSSProp;
  buttonStyle?: CSSProp;
  selectboxStyle?: CSSProp;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showNumbers = true,
  styles,
}: PaginationProps) {
  const [currentPageLocal, setCurrentPageLocal] = useState<string[]>([]);

  const comboboxPagesNumber = totalPages - 3;

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newValue = currentPage - 1;
      onPageChange(newValue);
      if (currentPage + 1 < totalPages) {
        setCurrentPageLocal([String(newValue)]);
      }
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newValue = currentPage + 1;
      onPageChange(newValue);
      if (currentPage < comboboxPagesNumber) {
        setCurrentPageLocal([String(newValue)]);
      }
    }
  };

  useEffect(() => {
    const safePage = clamp(currentPage, 1, comboboxPagesNumber);
    setCurrentPageLocal([String(safePage)]);
  }, []);

  return (
    <PaginationWrapper $style={styles?.containerStyle}>
      <PaginationButton
        styles={{ self: styles?.buttonStyle }}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <RiArrowLeftSLine size={20} />
      </PaginationButton>

      {showNumbers && (
        <PaginationItem
          styles={styles}
          currentPage={currentPage}
          currentPageLocal={currentPageLocal}
          onPageChange={onPageChange}
          totalPages={totalPages}
          setCurrentPageLocal={setCurrentPageLocal}
          comboboxPagesNumber={comboboxPagesNumber}
        />
      )}

      <PaginationButton
        styles={{ self: styles?.buttonStyle }}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <RiArrowRightSLine size={20} />
      </PaginationButton>
    </PaginationWrapper>
  );
}

const PaginationWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  ${({ $style }) => $style}
`;

const PaginationItem = ({
  totalPages,
  currentPage,
  currentPageLocal,
  onPageChange,
  setCurrentPageLocal,
  comboboxPagesNumber,
  styles,
}: {
  totalPages: number;
  currentPage: number;
  currentPageLocal: string[];
  onPageChange: (page: number) => void;
  setCurrentPageLocal: (page: string[]) => void;
  comboboxPagesNumber?: number;
  styles?: PaginationStyles;
}) => {
  const highlightOnMatch = useMemo(() => {
    return currentPage <= comboboxPagesNumber;
  }, [currentPage, comboboxPagesNumber]);

  const threshold = 5;

  const lastPages =
    totalPages > threshold
      ? Array.from({ length: 3 }, (_, i) => totalPages - 2 + i)
      : [];

  const comboBoxPages =
    totalPages > threshold
      ? Array.from({ length: totalPages - 3 }, (_, i) => i + 1)
      : [];

  const allPages =
    totalPages <= threshold
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : [];

  const formatOption = (page: string) => ({
    value: page,
    text: page,
  });

  return (
    <PaginationItemWrapper>
      {totalPages > threshold ? (
        <>
          <Combobox
            controlled
            highlightOnMatch={highlightOnMatch}
            options={comboBoxPages.map((data) => formatOption(String(data)))}
            selectedOptions={currentPageLocal}
            onChange={(val: string[]) => {
              onPageChange(Number(val[0]));
              setCurrentPageLocal(val);
            }}
            styles={{
              selectboxStyle: css`
                height: 39px;

                ${styles?.selectboxStyle};
              `,
              containerStyle: css`
                width: 80px;
                font-size: 14px;
              `,
            }}
            placeholder="1"
          />

          {lastPages.map((page) => {
            const isActive = currentPage === page;
            return (
              <PaginationButton
                styles={{ self: styles?.buttonStyle }}
                key={page}
                onClick={() => {
                  onPageChange(page);
                  if (Number(currentPageLocal[0]) > comboboxPagesNumber) {
                    setCurrentPageLocal([String(page)]);
                  }
                }}
                isActive={isActive}
              >
                {page}
              </PaginationButton>
            );
          })}
        </>
      ) : (
        <>
          {allPages.map((page) => {
            const isActive = currentPage === page;
            return (
              <PaginationButton
                styles={{ self: styles?.buttonStyle }}
                key={page}
                onClick={() => {
                  onPageChange(page);
                  setCurrentPageLocal([String(page)]);
                }}
                isActive={isActive}
              >
                {page}
              </PaginationButton>
            );
          })}
        </>
      )}
    </PaginationItemWrapper>
  );
};

const PaginationItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

interface PaginationButtonProps {
  onClick: () => void;
  children: ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  styles?: PaginationButtonStyles;
}

interface PaginationButtonStyles {
  self?: CSSProp;
}

const PaginationButton = ({
  onClick,
  styles,
  children,
  isActive,
  disabled,
  ...props
}: PaginationButtonProps) => {
  const { currentTheme } = useTheme();
  const paginationTheme = currentTheme?.pagination;

  return (
    <Button
      {...props}
      $theme={paginationTheme}
      aria-label="pagination-button"
      onClick={onClick}
      disabled={disabled}
      $style={styles?.self}
      $isActive={isActive}
    >
      {children}
    </Button>
  );
};

const Button = styled.button<{
  $isActive?: boolean;
  $style?: CSSProp;
  $theme: PaginationThemeConfig;
}>`
  min-width: 39px;
  min-height: 39px;
  max-width: 39px;
  max-height: 39px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  background-color: ${({ $theme }) => $theme.backgroundColor};

  border: 1px solid
    ${({ $isActive, $theme }) =>
      $isActive ? $theme.activeBorderColor : $theme.borderColor};

  color: ${({ $isActive, $theme }) =>
    $isActive ? $theme.activeTextColor : $theme.textColor};

  &:hover {
    border-color: ${({ $theme }) => $theme.hoverBorderColor};
  }

  &:disabled {
    cursor: default;
    opacity: 0.3;
    background-color: ${({ $theme }) => $theme.disabledBackgroundColor};
    color: ${({ $theme }) => $theme.disabledTextColor};

    &:hover {
      border-color: ${({ $isActive, $theme }) =>
        $isActive ? $theme.activeBorderColor : $theme.borderColor};
    }
  }

  ${({ $style }) => $style}
`;

export { Pagination };
