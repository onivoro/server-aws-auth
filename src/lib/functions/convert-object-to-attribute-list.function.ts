import { IAttribute } from "../interfaces/attribute.interface";

export function convertObjectToAttributeList(attributes: Record<string, string | number | null | undefined>): IAttribute[] {
    const attributeList: IAttribute[] = [];

    if (!attributes) {
        return [];
    }

    Object.entries(attributes).forEach(([Name, value]) => {
        const Value = (value ? value : (value ?? '')).toString();
        attributeList.push({ Name, Value })
    });

    return attributeList;
}