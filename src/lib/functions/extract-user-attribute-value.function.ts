import { AttributeListType } from "aws-sdk/clients/cognitoidentityserviceprovider";

export function extractUserAttributeValue(attributeName: string, attributes?: AttributeListType) {
    return (attributes || []).find(({ Name }) => Name === attributeName)?.Value || undefined;
}
