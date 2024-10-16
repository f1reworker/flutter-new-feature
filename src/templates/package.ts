export const packageFile = (pascalCaseName: string, snakeCaseName: string) =>
    `
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:varmatch/features/core/router/router.dart';
import 'package:varmatch/utils/api/config.dart';

import 'package:varmatch/theme/theme.dart';
import 'theme/theme.dart';

//MODELS
// part 'data/model';

//BLOC
part 'bloc/${snakeCaseName}_bloc.dart';
part 'bloc/${snakeCaseName}_event.dart';
part 'bloc/${snakeCaseName}_state.dart';

//SCREEN
// part 'screen';
part 'screen/${snakeCaseName}_screen.dart';

//WIDGETS
// part 'screen/widgets';

//COMPONENTS
// part 'screen/widgets/_/components';

var _feature = StandartTheme().${pascalCaseName}Screen; //THEME
`;