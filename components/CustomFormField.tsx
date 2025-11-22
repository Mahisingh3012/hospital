"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import type { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from "libphonenumber-js/core";
import DatePicker from "react-datepicker";
import { Textarea } from "./ui/textarea";
import "react-datepicker/dist/react-datepicker.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";



interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const { fieldType, iconSrc, iconAlt, placeholder, disabled, showTimeSelect, dateFormat, renderSkeleton } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex items-center rounded-md border border-gray-800 bg-gray-950 px-3">
          {iconSrc && (
            <Image
              src={iconSrc}
              width={24}
              height={24}
              alt={iconAlt || "icon"}
              className="mr-2"
            />
          )}

          <Input
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      );
      case FormFieldType.TEXTAREA:
        return (
          <FormControl>
            <Textarea
              placeholder={props.placeholder}
              {...field}
              className="shad-textArea"
              disabled={props.disabled}
            />
          </FormControl>
        );

    case FormFieldType.PHONE_INPUT:
      return (
        <div className="flex items-center rounded-md border border-gray-800 bg-gray-950 px-3">
          {iconSrc && (
            <Image
              src={iconSrc}
              width={24}
              height={24}
              alt={iconAlt || "phone-icon"}
              className="mr-2"
            />
          )}

          <PhoneInput
            defaultCountry="US"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="bg-transparent border-none focus-visible:ring-0 input-phone w-full"
          />
        </div>
      );

      case FormFieldType.SELECT:
        return (
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="shad-select-trigger">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="shad-select-content">
                {props.children}
              </SelectContent>
            </Select>
          </FormControl>
        );

      case FormFieldType.CHECKBOX:
         return (<FormControl>
          <div className="flex items-center gap-4">
          <Checkbox
          id={props.name}
          checked={field.value}
          onCheckedChange={field.onChange}
          />
      <label htmlFor={props.name}
      className="checkbox-label">
        {props.label}
      </label>

          </div>
        </FormControl>
         )

      case FormFieldType.DATE_PICKER:
        return (
          <div className="flex rounded-md border border-gray-800 bg-gray-950 ">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calender"
              className="ml-2"
            />
            <FormControl>
              <DatePicker
                showTimeSelect={props.showTimeSelect ?? false}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                timeInputLabel="Time:"
                dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
                wrapperClassName="date-picker"
              />
            </FormControl>
          </div>
        );
        case FormFieldType.SKELETON:
          return props.renderSkeleton ? props.renderSkeleton(field) : null;
        default:
          return null; 

     
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1 space-y-2">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <FormControl>
            <RenderField field={field} props={props} />
          </FormControl>

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField; 