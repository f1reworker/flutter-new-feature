export const widget = (pascalCaseName: string, featureName: string) =>
    `
part of '../../../package.dart';

class _${pascalCaseName} extends StatelessWidget {
  const _${pascalCaseName}();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<_${featureName}Bloc, _${featureName}State>(
      bloc: BlocProvider.of<_${featureName}Bloc>(context),
      builder: (context, state) {
        return const Placeholder();
      },
    );
  }
}
`;