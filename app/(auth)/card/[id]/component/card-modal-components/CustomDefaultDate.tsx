import { FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormContext } from "react-hook-form"

export const CustomDefaultDate = ({ isDefault }: { isDefault: boolean }) => {
    const { setValue, getValues } = useFormContext()

    const updateCustomDefaultDate = (position: number, value: string) => {
        const newVal = getValues()["defaultDate"].split(" ")
        newVal[position] = value
        setValue("defaultDate", newVal.join(" "))
    }

    let defaultOperator = "add"
    let defaultValue = "1"
    let defaultPeriod = "day"

    if (isDefault) {
        const data = getValues("defaultDate").split(" ")
        defaultOperator = data[0]
        defaultValue = data[1]
        defaultPeriod = data[2]
    }

    return (
        <div className="grid grid-cols-3 mt-2">
            <Select
                onValueChange={(val) => updateCustomDefaultDate(0, val)}
                defaultValue={defaultOperator}
            >
                <FormControl>
                    <SelectTrigger>
                        <SelectValue
                            placeholder="Select to add or subtract" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="add">add</SelectItem>
                    <SelectItem value="sub">sub</SelectItem>
                </SelectContent>
            </Select>

            <Input
                onBlur={(val) => updateCustomDefaultDate(1, val.target.value)}
                placeholder="1"
                defaultValue={defaultValue}
            />

            <Select
                onValueChange={(val) => updateCustomDefaultDate(2, val)}
                defaultValue={defaultPeriod}
            >
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="day">day(s)</SelectItem>
                    <SelectItem value="week">week(s)</SelectItem>
                    <SelectItem value="month">month(s)</SelectItem>
                    <SelectItem value="year">year(s)</SelectItem>
                </SelectContent>
            </Select>


        </div>
    )
}