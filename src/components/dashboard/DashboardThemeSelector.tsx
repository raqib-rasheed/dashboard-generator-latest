import { Select } from 'antd'
import React from 'react'

interface IDashBoardFilterProps {
  setTheme: React.Dispatch<React.SetStateAction<any>>
  selectedTheme: string
}

export default function DashboardThemeSelector({
  setTheme,
  selectedTheme,
}: IDashBoardFilterProps) {
  function handleThemeChange(selectedTheme: string) {
    !Array.isArray(selectedTheme) && setTheme(selectedTheme as any)
  }

  return (
    <>
      <span className="mr-5 text-gray">Choose chart theme :</span>
      <Select
        value={selectedTheme}
        style={{ width: 120 }}
        onChange={handleThemeChange}
      >
        <Select.Option value="defaultTheme">Default</Select.Option>
        <Select.Option value="Dark">Dark</Select.Option>
        <Select.Option value="Violet">Violet</Select.Option>
        <Select.Option value="Green">Green</Select.Option>
        <Select.Option value="MonoBlue">Blue</Select.Option>
      </Select>
    </>
  )
}
