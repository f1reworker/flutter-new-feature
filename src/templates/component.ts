export const component = (pascalCaseName: string) =>
    `
part of '../../../../package.dart';

class _${pascalCaseName} extends StatelessWidget {
  const _${pascalCaseName}();

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
`;