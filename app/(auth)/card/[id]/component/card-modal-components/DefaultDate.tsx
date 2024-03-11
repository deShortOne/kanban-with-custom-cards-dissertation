import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CustomDefaultDate } from "./CustomDefaultDate";


export const DefaultDate = ({ defaultDate }: { defaultDate: string }) => {

    const { setValue, getValues } = useFormContext()
    const [showCustom, setShowCustom] = useState(false)

    const radioGroupChange = (val: string) => {
        if (val === "" || val === "today") {
            setShowCustom(false)
            setValue("defaultDate", val)
        } else {
            setShowCustom(true)
            setValue("defaultDate", foundCustomDateRegex ? defaultDate : "add 1 day")
        }
    }

    const customDateRegex = /^(add|sub) \d+ (day|week|month|year)s?$/;
    const foundCustomDateRegex = defaultDate.match(customDateRegex) !== null;

    const defaultValueRadio = foundCustomDateRegex ? "Custom" : defaultDate;
    useEffect(() => {
        setShowCustom(foundCustomDateRegex)
    }, [setShowCustom, foundCustomDateRegex])

    return (
        <div>
            <div className="flex">
                <FormLabel className="inline-block align-bottom">
                    Default date
                </FormLabel>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild className="h-[20px]">
                            <button type="button">
                                <Image
                                    src="/help.svg"
                                    alt="default date rules"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Relative to when the card is created</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <RadioGroup
                onValueChange={radioGroupChange}
                defaultValue={defaultValueRadio}
                className="flex flex-col space-y-1"
            >
                <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                        <RadioGroupItem value="" />
                    </FormControl>
                    <FormLabel className="font-normal">
                        None
                    </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                        <RadioGroupItem value="today" />
                    </FormControl>
                    <FormLabel className="font-normal">
                        Today
                    </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                        <RadioGroupItem value="Custom" />
                    </FormControl>
                    <FormLabel className="font-normal">
                        Custom
                    </FormLabel>
                </FormItem>
            </RadioGroup>

            {showCustom && <CustomDefaultDate isDefault={foundCustomDateRegex} defaultDate={defaultDate} />}
        </div>
    )
}
