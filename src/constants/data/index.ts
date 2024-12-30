import {
  appleImage,
  bananaImage,
  pineAppleImage,
} from "@/components/custom/svgIcon";

export interface SelectOption {
  label: string;
  value: string;
  image: string; // Path to the local image
}

export const fruitOptions: SelectOption[] = [
  { label: "Apple", value: "apple", image: appleImage },
  { label: "Banana", value: "banana", image: bananaImage },
  { label: "Pineapple", value: "pineapple", image: pineAppleImage },
];
