export const theme = (pascalCaseName: string) =>
    `
import 'package:flutter/material.dart';
import 'package:varmatch/theme/scr/app_colors.dart';
import 'package:varmatch/theme/scr/app_text_styles.dart';
import 'package:varmatch/theme/theme.dart';

final class _${pascalCaseName}ThemeText {
  TextStyle get example => AppTextStyles.medium16.copyWith(
    color: AppColors.white,
  );
}

final _text = _${pascalCaseName}ThemeText();

final class _${pascalCaseName}ThemeColors {
  Color get example => AppColors.white04;
}

final _colors = _${pascalCaseName}ThemeColors();

class _${pascalCaseName}Theme {
  _${pascalCaseName}ThemeColors get color => _colors;
  _${pascalCaseName}ThemeText get text => _text;
}

extension ${pascalCaseName}StandartTheme on StandartTheme {
  // ignore: library_private_types_in_public_api, non_constant_identifier_names
  _${pascalCaseName}Theme get ${pascalCaseName}Screen => _${pascalCaseName}Theme();
}
`;