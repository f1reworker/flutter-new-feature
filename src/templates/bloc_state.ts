export const blocState = (pascalCaseName: string) =>
    `
part of '../package.dart';

sealed class _${pascalCaseName}State {}

final class _${pascalCaseName}Initial implements _${pascalCaseName}State {}

final class _ServerNotAvailableState implements _${pascalCaseName}State {
  final Map<String, dynamic>? mutedData;
  _ServerNotAvailableState(this.mutedData);
}

final class _NoNetworkState implements _${pascalCaseName}State {}
`;