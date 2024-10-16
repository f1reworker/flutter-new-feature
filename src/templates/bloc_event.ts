export const blocEvent = (pascalCaseName: string) =>
    `
part of '../package.dart';

sealed class _${pascalCaseName}Event {}

final class _${pascalCaseName}GetEvent implements _${pascalCaseName}Event {}
`;