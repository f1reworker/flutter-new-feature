export const screen = (pascalCaseName: string) =>
    `
part of '../package.dart';

class ${pascalCaseName}Screen extends StatefulWidget {
  const ${pascalCaseName}Screen({super.key});

  @override
  State<${pascalCaseName}Screen> createState() => _${pascalCaseName}ScreenState();
}

class _${pascalCaseName}ScreenState extends State<${pascalCaseName}Screen> {
  late final _${pascalCaseName}Bloc bloc;

  @override
  void initState() {
    bloc = _${pascalCaseName}Bloc()..add(_${pascalCaseName}GetEvent());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => bloc,
      child: BlocConsumer<_${pascalCaseName}Bloc, _${pascalCaseName}State>(
        bloc: bloc,
        listener: (context, state) {
          if (state is _NoNetworkState) {
            context.go(routes.no_network_page);
          }
          if (state is _ServerNotAvailableState) {
            context.go(routes.server_not_awailable, extra: state.mutedData);
          }
        },
        builder: (context, state) {
          return const Placeholder();
        }
      ),
    );
  }
}
`;