import * as path from 'path'

import * as E from '../dist/es6/Either.js'
import { pipe } from '../dist/es6/function.js'
import * as J from '../dist/es6/Json.js'
import * as RTE from '../dist/es6/ReaderTaskEither.js'
import * as TE from '../dist/es6/TaskEither.js'
import { FileSystem, fileSystem } from './FileSystem.js'
import { run } from './run.js'

interface Build<A> extends RTE.ReaderTaskEither<FileSystem, Error, A> {}

const OUTPUT_FOLDER = 'dist'
const PKG = 'package.json'

export const copyPackageJson: Build<void> = (C) =>
  pipe(
    C.readFile(PKG),
    TE.flatMap((s) => TE.fromEither(pipe(J.parse(s), E.mapLeft(E.toError)))),
    TE.map((json) => {
      const clone = Object.assign({}, json as any)

      delete clone.scripts
      delete clone.files
      delete clone.devDependencies

      return clone
    }),
    TE.flatMap((json) => C.writeFile(path.join(OUTPUT_FOLDER, PKG), JSON.stringify(json, null, 2)))
  )

export const FILES: ReadonlyArray<string> = ['CHANGELOG.md', 'LICENSE', 'README.md']

export const copyFiles: Build<ReadonlyArray<void>> = (C) =>
  pipe(
    FILES,
    TE.traverseReadonlyArrayWithIndex((_, from) => C.copyFile(from, path.resolve(OUTPUT_FOLDER, from)))
  )

export const makeModules: Build<void> = (C) => {
  const makeSingleModuleC = makeSingleModule(C)
  return pipe(
    C.glob(`${OUTPUT_FOLDER}/lib/*.js`),
    TE.map(getModules),
    TE.flatMap(TE.traverseReadonlyArrayWithIndex((_, a) => makeSingleModuleC(a))),
    TE.map(() => undefined)
  )
}

function getModules(paths: ReadonlyArray<string>): ReadonlyArray<string> {
  return paths.map((filePath) => path.basename(filePath, '.js')).filter((x) => x !== 'index')
}

function makeSingleModule(C: FileSystem): (module: string) => TE.TaskEither<Error, void> {
  return (m) =>
    pipe(
      C.mkdir(path.join(OUTPUT_FOLDER, m)),
      TE.flatMap(() => makePkgJson(m)),
      TE.flatMap((data) => C.writeFile(path.join(OUTPUT_FOLDER, m, 'package.json'), data))
    )
}

function makePkgJson(module: string): TE.TaskEither<Error, string> {
  return pipe(
    JSON.stringify(
      {
        main: `../lib/${module}.js`,
        module: `../es6/${module}.js`,
        typings: module === 'HKT' ? `../HKT.d.ts` : `../lib/${module}.d.ts`,
        sideEffects: false
      },
      null,
      2
    ),
    TE.right
  )
}

const fixHKT = (folder: string): Build<void> =>
  pipe(
    (C: FileSystem) => C.mkdir(path.join(OUTPUT_FOLDER, folder, 'HKT')),
    RTE.flatMap(
      (): Build<void> => (C) =>
        C.writeFile(
          path.join(OUTPUT_FOLDER, folder, 'HKT', 'package.json'),
          JSON.stringify({ typings: '../../HKT.d.ts' }, null, 2)
        )
    ),
    RTE.flatMap(
      (): Build<void> => (C) =>
        C.moveFile(path.join(OUTPUT_FOLDER, folder, 'HKT.js'), path.join(OUTPUT_FOLDER, folder, 'HKT', 'index.js'))
    ),
    RTE.flatMap(
      (): Build<void> => (C) =>
        C.moveFile(path.join(OUTPUT_FOLDER, folder, 'HKT.d.ts'), path.join(OUTPUT_FOLDER, 'HKT.d.ts'))
    )
  )

const main: Build<void> = pipe(
  copyPackageJson,
  RTE.flatMap(() => copyFiles),
  RTE.flatMap(() => makeModules),
  RTE.flatMap(() => fixHKT('es6')),
  RTE.flatMap(() => fixHKT('lib'))
)

run(
  main({
    ...fileSystem
  })
)
