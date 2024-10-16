export const modelFromJson = (pascalCaseName: string) =>
    `
part of '../../package.dart';

class ${pascalCaseName} {
  ${pascalCaseName}();

  
  factory ${pascalCaseName}.fromJson(Map<String, dynamic> json) {
    return ${pascalCaseName}(
    );
  }
}
`;