export const bloc = (pascalCaseName: string) =>
    `
part of '../package.dart';

class _${pascalCaseName}Bloc extends Bloc<_${pascalCaseName}Event, _${pascalCaseName}State> {
  _${pascalCaseName}Bloc() : super(_${pascalCaseName}Initial()) {
    on<_${pascalCaseName}GetEvent>((event, emit) async {
      bool isInternetConnected = await checkInternetConnection();
      if (isInternetConnected) {}
      else {
        emit(_NoNetworkState());
      }
    });
  }  
}
`;