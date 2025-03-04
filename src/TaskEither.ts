/**
 * ```ts
 * interface TaskEither<E, A> extends Task<Either<E, A>> {}
 * ```
 *
 * `TaskEither<E, A>` represents an asynchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `E`. If you want to represent an asynchronous computation that never fails, please see `Task`.
 *
 * @since 2.0.0
 */
import { Alt2, Alt2C } from './Alt.js'
import { Applicative2, Applicative2C, getApplicativeMonoid } from './Applicative.js'
import {
  ap as ap_,
  apFirst as apFirst_,
  Apply1,
  Apply2,
  apS as apS_,
  apSecond as apSecond_,
  getApplySemigroup as getApplySemigroup_
} from './Apply.js'
import { Bifunctor2 } from './Bifunctor.js'
import * as chainable from './Chain.js'
import { compact as compact_, Compactable2C, separate as separate_ } from './Compactable.js'
import * as E from './Either.js'
import * as ET from './EitherT.js'
import {
  filter as filter_,
  Filterable2C,
  filterMap as filterMap_,
  partition as partition_,
  partitionMap as partitionMap_
} from './Filterable.js'
import {
  chainOptionK as chainOptionK_,
  filterOrElse as filterOrElse_,
  FromEither2,
  fromEitherK as fromEitherK_,
  fromOption as fromOption_,
  fromOptionK as fromOptionK_,
  fromPredicate as fromPredicate_,
  tapEither as tapEither_
} from './FromEither.js'
import { FromIO2, fromIOK as fromIOK_, tapIO as tapIO_ } from './FromIO.js'
import { FromTask2, fromTaskK as fromTaskK_, tapTask as tapTask_ } from './FromTask.js'
import { dual, flow, identity, LazyArg, pipe, SK } from './function.js'
import { as as as_, asUnit as asUnit_, bindTo as bindTo_, flap as flap_, Functor2, let as let__ } from './Functor.js'
import * as _ from './internal.js'
import { IO } from './IO.js'
import { IOEither } from './IOEither.js'
import { Monad2, Monad2C } from './Monad.js'
import { MonadIO2 } from './MonadIO.js'
import { MonadTask2, MonadTask2C } from './MonadTask.js'
import { MonadThrow2, MonadThrow2C } from './MonadThrow.js'
import { Monoid } from './Monoid.js'
import { NonEmptyArray } from './NonEmptyArray.js'
import { Option } from './Option.js'
import { Pointed2 } from './Pointed.js'
import { Predicate } from './Predicate.js'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray.js'
import { Refinement } from './Refinement.js'
import { Semigroup } from './Semigroup.js'
import * as T from './Task.js'
import { TaskOption } from './TaskOption.js'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

import Either = E.Either
import Task = T.Task

/**
 * @category model
 * @since 2.0.0
 */
export interface TaskEither<E, A> extends Task<Either<E, A>> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.0.0
 */
export const left: <E = never, A = never>(e: E) => TaskEither<E, A> = /*#__PURE__*/ ET.left(T.Pointed)

/**
 * @category constructors
 * @since 2.0.0
 */
export const right: <E = never, A = never>(a: A) => TaskEither<E, A> = /*#__PURE__*/ ET.right(T.Pointed)

/**
 * @category constructors
 * @since 2.0.0
 */
export const rightTask: <E = never, A = never>(ma: Task<A>) => TaskEither<E, A> = /*#__PURE__*/ ET.rightF(T.Functor)

/**
 * @category constructors
 * @since 2.0.0
 */
export const leftTask: <E = never, A = never>(me: Task<E>) => TaskEither<E, A> = /*#__PURE__*/ ET.leftF(T.Functor)

/**
 * @category constructors
 * @since 2.0.0
 */
export const rightIO: <E = never, A = never>(ma: IO<A>) => TaskEither<E, A> = /*#__PURE__*/ flow(T.fromIO, rightTask)

/**
 * @category constructors
 * @since 2.0.0
 */
export const leftIO: <E = never, A = never>(me: IO<E>) => TaskEither<E, A> = /*#__PURE__*/ flow(T.fromIO, leftTask)

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * @category conversions
 * @since 2.7.0
 */
export const fromIO: <A, E = never>(fa: IO<A>) => TaskEither<E, A> = rightIO

/**
 * @category conversions
 * @since 2.7.0
 */
export const fromTask: <A, E = never>(fa: Task<A>) => TaskEither<E, A> = rightTask

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromEither: <E, A>(fa: Either<E, A>) => TaskEither<E, A> = T.of

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => TaskEither<E, A> = T.fromIO

/**
 * @category conversions
 * @since 2.11.0
 */
export const fromTaskOption: <E>(onNone: LazyArg<E>) => <A>(fa: TaskOption<A>) => TaskEither<E, A> = (onNone) =>
  T.map(E.fromOption(onNone))

/**
 * @category pattern matching
 * @since 2.10.0
 */
export const match: <E, B, A>(onLeft: (e: E) => B, onRight: (a: A) => B) => (ma: TaskEither<E, A>) => Task<B> =
  /*#__PURE__*/ ET.match(T.Functor)

/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchW: <E, B, A, C>(onLeft: (e: E) => B, onRight: (a: A) => C) => (ma: TaskEither<E, A>) => Task<B | C> =
  match as any

/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchE: <E, A, B>(
  onLeft: (e: E) => Task<B>,
  onRight: (a: A) => Task<B>
) => (ma: TaskEither<E, A>) => Task<B> = /*#__PURE__*/ ET.matchE(T.Monad)

/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.0.0
 */
export const fold = matchE

/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchEW: <E, B, A, C>(
  onLeft: (e: E) => Task<B>,
  onRight: (a: A) => Task<C>
) => (ma: TaskEither<E, A>) => Task<B | C> = matchE as any

/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const foldW = matchEW

/**
 * @category error handling
 * @since 2.0.0
 */
export const getOrElse: <E, A>(onLeft: (e: E) => Task<A>) => (ma: TaskEither<E, A>) => Task<A> =
  /*#__PURE__*/ ET.getOrElse(T.Monad)

/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
export const getOrElseW: <E, B>(onLeft: (e: E) => Task<B>) => <A>(ma: TaskEither<E, A>) => Task<A | B> =
  getOrElse as any

/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Either` instead.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { left, right } from 'fp-ts/Either'
 * import { tryCatch } from 'fp-ts/TaskEither'
 *
 * tryCatch(() => Promise.resolve(1), String)().then(result => {
 *   assert.deepStrictEqual(result, right(1))
 * })
 * tryCatch(() => Promise.reject('error'), String)().then(result => {
 *   assert.deepStrictEqual(result, left('error'))
 * })
 *
 * @category interop
 * @since 2.0.0
 */
export const tryCatch =
  <E, A>(f: LazyArg<Promise<A>>, onRejected: (reason: unknown) => E): TaskEither<E, A> =>
  async () => {
    try {
      return await f().then(_.right)
    } catch (reason) {
      return _.left(onRejected(reason))
    }
  }

/**
 * Converts a function returning a `Promise` to one returning a `TaskEither`.
 *
 * @category interop
 * @since 2.5.0
 */
export const tryCatchK =
  <E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => Promise<B>,
    onRejected: (reason: unknown) => E
  ): ((...a: A) => TaskEither<E, B>) =>
  (...a) =>
    tryCatch(() => f(...a), onRejected)

/**
 * @category conversions
 * @since 2.10.0
 */
export const toUnion: <E, A>(fa: TaskEither<E, A>) => Task<E | A> = /*#__PURE__*/ ET.toUnion(T.Functor)

/**
 * @category conversions
 * @since 2.12.0
 */
export const fromNullable: <E>(e: E) => <A>(a: A) => TaskEither<E, NonNullable<A>> = /*#__PURE__*/ ET.fromNullable(
  T.Pointed
)

/**
 * Use `liftNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const fromNullableK: <E>(
  e: E
) => <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
) => (...a: A) => TaskEither<E, NonNullable<B>> = /*#__PURE__*/ ET.fromNullableK(T.Pointed)

/**
 * Use `flatMapNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainNullableK: <E>(
  e: E
) => <A, B>(f: (a: A) => B | null | undefined) => (ma: TaskEither<E, A>) => TaskEither<E, NonNullable<B>> =
  /*#__PURE__*/ ET.chainNullableK(T.Monad)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Returns `ma` if is a `Right` or the value returned by `onLeft` otherwise.
 *
 * See also [alt](#alt).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   const errorHandler = TE.orElse((error: string) => TE.right(`recovering from ${error}...`))
 *   assert.deepStrictEqual(await pipe(TE.right('ok'), errorHandler)(), E.right('ok'))
 *   assert.deepStrictEqual(await pipe(TE.left('ko'), errorHandler)(), E.right('recovering from ko...'))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
export const orElse: <E1, A, E2>(onLeft: (e: E1) => TaskEither<E2, A>) => (ma: TaskEither<E1, A>) => TaskEither<E2, A> =
  /*#__PURE__*/ ET.orElse(T.Monad)

/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
export const orElseW: <E1, E2, B>(
  onLeft: (e: E1) => TaskEither<E2, B>
) => <A>(ma: TaskEither<E1, A>) => TaskEither<E2, A | B> = orElse as any

/**
 * Returns an effect that effectfully "peeks" at the failure of this effect.
 *
 * @category error handling
 * @since 2.15.0
 */
export const tapError: {
  <E1, E2, _>(onLeft: (e: E1) => TaskEither<E2, _>): <A>(self: TaskEither<E1, A>) => TaskEither<E1 | E2, A>
  <E1, A, E2, _>(self: TaskEither<E1, A>, onLeft: (e: E1) => TaskEither<E2, _>): TaskEither<E1 | E2, A>
} = /*#__PURE__*/ dual(2, ET.tapError(T.Monad))

/**
 * @category error handling
 * @since 2.12.0
 */
export const orElseFirstIOK: <E, B>(onLeft: (e: E) => IO<B>) => <A>(ma: TaskEither<E, A>) => TaskEither<E, A> = (
  onLeft
) => tapError(fromIOK(onLeft))

/**
 * @category error handling
 * @since 2.12.0
 */
export const orElseFirstTaskK: <E, B>(onLeft: (e: E) => Task<B>) => <A>(ma: TaskEither<E, A>) => TaskEither<E, A> = (
  onLeft
) => tapError(fromTaskK(onLeft))

/**
 * @category error handling
 * @since 2.11.0
 */
export const orLeft: <E1, E2>(onLeft: (e: E1) => Task<E2>) => <A>(fa: TaskEither<E1, A>) => TaskEither<E2, A> =
  /*#__PURE__*/ ET.orLeft(T.Monad)

/**
 * @since 2.0.0
 */
export const swap: <E, A>(ma: TaskEither<E, A>) => TaskEither<A, E> = /*#__PURE__*/ ET.swap(T.Functor)

/**
 * @category lifting
 * @since 2.11.0
 */
export const fromTaskOptionK = <E>(
  onNone: LazyArg<E>
): (<A extends ReadonlyArray<unknown>, B>(f: (...a: A) => TaskOption<B>) => (...a: A) => TaskEither<E, B>) => {
  const from = fromTaskOption(onNone)
  return (f) => flow(f, from)
}

/**
 * Use `flatMapTaskOption`.
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.12.3
 */
export const chainTaskOptionKW =
  <E2>(onNone: LazyArg<E2>) =>
  <A, B>(f: (a: A) => TaskOption<B>) =>
  <E1>(ma: TaskEither<E1, A>): TaskEither<E1 | E2, B> =>
    flatMap(ma, fromTaskOptionK<E1 | E2>(onNone)(f))

/**
 * Use `flatMapTaskOption`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainTaskOptionK: <E>(
  onNone: LazyArg<E>
) => <A, B>(f: (a: A) => TaskOption<B>) => (ma: TaskEither<E, A>) => TaskEither<E, B> = chainTaskOptionKW

/**
 * @category lifting
 * @since 2.4.0
 */
export const fromIOEitherK = <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IOEither<E, B>
): ((...a: A) => TaskEither<E, B>) => flow(f, fromIOEither)

const _map: Functor2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _apPar: Apply2<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const _apSeq: Apply2<URI>['ap'] = (fab, fa) => flatMap(fab, (f) => pipe(fa, map(f)))
/* istanbul ignore next */
const _alt: Alt2<URI>['alt'] = (fa, that) => pipe(fa, alt(that))

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map: <A, B>(f: (a: A) => B) => <E>(fa: TaskEither<E, A>) => TaskEither<E, B> = /*#__PURE__*/ ET.map(
  T.Functor
)

/**
 * Returns a `TaskEither` whose failure and success channels have been mapped by the specified pair of functions, `f` and `g`.
 *
 * @example
 * import * as TaskEither from 'fp-ts/TaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 * const g = (n: number) => n * 2
 *
 * async function test() {
 *   assert.deepStrictEqual(await TaskEither.mapBoth(TaskEither.right(1), f, g)(), Either.right(2))
 *   assert.deepStrictEqual(await TaskEither.mapBoth(TaskEither.left('err'), f, g)(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
export const mapBoth: {
  <E, G, A, B>(f: (e: E) => G, g: (a: A) => B): (self: TaskEither<E, A>) => TaskEither<G, B>
  <E, A, G, B>(self: TaskEither<E, A>, f: (e: E) => G, g: (a: A) => B): TaskEither<G, B>
} = /*#__PURE__*/ dual(3, ET.mapBoth(T.Functor))

/**
 * Alias of `mapBoth`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: TaskEither<E, A>) => TaskEither<G, B> = mapBoth

/**
 * Returns a `TaskEither` with its error channel mapped using the specified function.
 *
 * @example
 * import * as TaskEither from 'fp-ts/TaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 *
 * async function test() {
 *   assert.deepStrictEqual(await TaskEither.mapError(TaskEither.right(1), f)(), Either.right(1))
 *   assert.deepStrictEqual(await TaskEither.mapError(TaskEither.left('err'), f)(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
export const mapError: {
  <E, G>(f: (e: E) => G): <A>(self: TaskEither<E, A>) => TaskEither<G, A>
  <E, A, G>(self: TaskEither<E, A>, f: (e: E) => G): TaskEither<G, A>
} = /*#__PURE__*/ dual(2, ET.mapError(T.Functor))

/**
 * Alias of `mapError`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: TaskEither<E, A>) => TaskEither<G, A> = mapError

/**
 * @since 2.0.0
 */
export const ap: <E, A>(fa: TaskEither<E, A>) => <B>(fab: TaskEither<E, (a: A) => B>) => TaskEither<E, B> =
  /*#__PURE__*/ ET.ap(T.ApplyPar)

/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.8.0
 */
export const apW: <E2, A>(
  fa: TaskEither<E2, A>
) => <E1, B>(fab: TaskEither<E1, (a: A) => B>) => TaskEither<E1 | E2, B> = ap as any

/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap: {
  <A, E2, B>(f: (a: A) => TaskEither<E2, B>): <E1>(ma: TaskEither<E1, A>) => TaskEither<E1 | E2, B>
  <E1, A, E2, B>(ma: TaskEither<E1, A>, f: (a: A) => TaskEither<E2, B>): TaskEither<E1 | E2, B>
} = /*#__PURE__*/ dual(2, ET.flatMap(T.Monad))

/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const flattenW: <E1, E2, A>(mma: TaskEither<E1, TaskEither<E2, A>>) => TaskEither<E1 | E2, A> =
  /*#__PURE__*/ flatMap(identity)

/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten: <E, A>(mma: TaskEither<E, TaskEither<E, A>>) => TaskEither<E, A> = flattenW

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `TaskEither` returns `fa` if is a `Right` or the value returned by `that` otherwise.
 *
 * See also [orElse](#orelse).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.right(1),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(1)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(2)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.left('b'))
 *     )(),
 *     E.left('b')
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
export const alt: <E, A>(that: LazyArg<TaskEither<E, A>>) => (fa: TaskEither<E, A>) => TaskEither<E, A> =
  /*#__PURE__*/ ET.alt(T.Monad)

/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW: <E2, B>(
  that: LazyArg<TaskEither<E2, B>>
) => <E1, A>(fa: TaskEither<E1, A>) => TaskEither<E2, A | B> = alt as any

/**
 * @category constructors
 * @since 2.0.0
 */
export const of: <E = never, A = never>(a: A) => TaskEither<E, A> = right

/**
 * @since 2.7.0
 */
export const throwError: MonadThrow2<URI>['throwError'] = left

/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'TaskEither'

/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI

declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: TaskEither<E, A>
  }
}

/**
 * The default [`ApplicativePar`](#applicativepar) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 * import * as T from 'fp-ts/Task'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * interface User {
 *   readonly id: string
 *   readonly name: string
 * }
 *
 * const remoteDatabase: ReadonlyArray<User> = [
 *   { id: 'id1', name: 'John' },
 *   { id: 'id2', name: 'Mary' },
 *   { id: 'id3', name: 'Joey' }
 * ]
 *
 * const fetchUser = (id: string): TE.TaskEither<string, User> =>
 *   pipe(
 *     remoteDatabase,
 *     RA.findFirst((user) => user.id === id),
 *     TE.fromOption(() => `${id} not found`)
 *   )
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(TE.ApplicativePar)(fetchUser))(),
 *     E.left('id4 not found') // <= first error
 *   )
 *
 *   const Applicative = TE.getApplicativeTaskValidation(
 *     T.ApplyPar,
 *     pipe(string.Semigroup, S.intercalate(', '))
 *   )
 *
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(Applicative)(fetchUser))(),
 *     E.left('id4 not found, id5 not found') // <= all errors
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.7.0
 */
export function getApplicativeTaskValidation<E>(A: Apply1<T.URI>, S: Semigroup<E>): Applicative2C<URI, E> {
  const ap = ap_(A, E.getApplicativeValidation(S))
  return {
    URI,
    _E: undefined as any,
    map: _map,
    ap: (fab, fa) => pipe(fab, ap(fa)),
    of
  }
}

/**
 * The default [`Alt`](#alt) instance returns the last error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getAltValidation`](./Either.ts.html#getaltvalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
export function getAltTaskValidation<E>(S: Semigroup<E>): Alt2C<URI, E> {
  const alt = ET.altValidation(T.Monad, S)
  return {
    URI,
    _E: undefined as any,
    map: _map,
    alt: (fa, that) => pipe(fa, alt(that))
  }
}

/**
 * @category filtering
 * @since 2.10.0
 */
export const getCompactable = <E>(M: Monoid<E>): Compactable2C<URI, E> => {
  const C = E.getCompactable(M)
  return {
    URI,
    _E: undefined as any,
    compact: compact_(T.Functor, C),
    separate: separate_(T.Functor, C, E.Functor)
  }
}

/**
 * @category filtering
 * @since 2.1.0
 */
export function getFilterable<E>(M: Monoid<E>): Filterable2C<URI, E> {
  const F = E.getFilterable(M)
  const C = getCompactable(M)

  const filter = filter_(T.Functor, F)
  const filterMap = filterMap_(T.Functor, F)
  const partition = partition_(T.Functor, F)
  const partitionMap = partitionMap_(T.Functor, F)
  return {
    URI,
    _E: undefined as any,
    map: _map,
    compact: C.compact,
    separate: C.separate,
    filter: <A>(fa: TaskEither<E, A>, predicate: Predicate<A>) => pipe(fa, filter(predicate)),
    filterMap: (fa, f) => pipe(fa, filterMap(f)),
    partition: <A>(fa: TaskEither<E, A>, predicate: Predicate<A>) => pipe(fa, partition(predicate)),
    partitionMap: (fa, f) => pipe(fa, partitionMap(f))
  }
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Functor: Functor2<URI> = {
  URI,
  map: _map
}

/**
 * Maps the `Right` value of this `TaskEither` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export const as: {
  <A>(a: A): <E, _>(self: TaskEither<E, _>) => TaskEither<E, A>
  <E, _, A>(self: TaskEither<E, _>, a: A): TaskEither<E, A>
} = dual(2, as_(Functor))

/**
 * Maps the `Right` value of this `TaskEither` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export const asUnit: <E, _>(self: TaskEither<E, _>) => TaskEither<E, void> = asUnit_(Functor)

/**
 * @category mapping
 * @since 2.10.0
 */
export const flap = /*#__PURE__*/ flap_(Functor)

/**
 * @category instances
 * @since 2.10.0
 */
export const Pointed: Pointed2<URI> = {
  URI,
  of
}

/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
export const ApplyPar: Apply2<URI> = {
  URI,
  map: _map,
  ap: _apPar
}

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
export const apFirst = /*#__PURE__*/ apFirst_(ApplyPar)

/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
export const apFirstW: <E2, B>(
  second: TaskEither<E2, B>
) => <E1, A>(first: TaskEither<E1, A>) => TaskEither<E1 | E2, A> = apFirst as any

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export const apSecond = /*#__PURE__*/ apSecond_(ApplyPar)

/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
export const apSecondW: <E2, B>(
  second: TaskEither<E2, B>
) => <E1, A>(first: TaskEither<E1, A>) => TaskEither<E1 | E2, B> = apSecond as any

/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
export const ApplicativePar: Applicative2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  of
}

/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
export const ApplySeq: Apply2<URI> = {
  URI,
  map: _map,
  ap: _apSeq
}

/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
export const ApplicativeSeq: Applicative2<URI> = {
  URI,
  map: _map,
  ap: _apSeq,
  of
}

/**
 * @category instances
 * @since 2.10.0
 */
export const Chain: chainable.Chain2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: flatMap
}

/**
 * @category instances
 * @since 2.10.0
 */
export const Monad: Monad2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: flatMap,
  of
}

/**
 * @category instances
 * @since 2.10.0
 */
export const MonadIO: MonadIO2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: flatMap,
  of,
  fromIO
}

/**
 * @category instances
 * @since 2.10.0
 */
export const MonadTask: MonadTask2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: flatMap,
  of,
  fromIO,
  fromTask
}

/**
 * @category instances
 * @since 2.10.0
 */
export const MonadThrow: MonadThrow2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: flatMap,
  of,
  throwError
}

/**
 * @category instances
 * @since 2.10.0
 */
export const FromEither: FromEither2<URI> = {
  URI,
  fromEither
}

/**
 * @category instances
 * @since 2.10.0
 */
export const FromIO: FromIO2<URI> = {
  URI,
  fromIO
}

/**
 * @category instances
 * @since 2.10.0
 */
export const FromTask: FromTask2<URI> = {
  URI,
  fromIO,
  fromTask
}

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export const tap: {
  <E1, A, E2, _>(self: TaskEither<E1, A>, f: (a: A) => TaskEither<E2, _>): TaskEither<E1 | E2, A>
  <A, E2, _>(f: (a: A) => TaskEither<E2, _>): <E1>(self: TaskEither<E1, A>) => TaskEither<E2 | E1, A>
} = /*#__PURE__*/ dual(2, chainable.tap(Chain))

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * const checkString = (value: string) => pipe(
 *   TE.of(value),
 *   TE.tapEither(() => value.length > 0 ? E.right('ok') : E.left('error'))
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await checkString('')(), E.left('error'))
 *   assert.deepStrictEqual(await checkString('fp-ts')(), E.right('fp-ts'))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export const tapEither: {
  <A, E2, _>(f: (a: A) => Either<E2, _>): <E1>(self: TaskEither<E1, A>) => TaskEither<E2 | E1, A>
  <E1, A, E2, _>(self: TaskEither<E1, A>, f: (a: A) => Either<E2, _>): TaskEither<E1 | E2, A>
} = /*#__PURE__*/ dual(2, tapEither_(FromEither, Chain))

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 * import * as E from 'fp-ts/Either'
 * import * as Console from 'fp-ts/Console'
 *
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effectA = TE.tapIO(
 *   TE.of(1),
 *   (value) => Console.log(`Hello, ${value}`)
 * )
 *
 * // No output to the stdout
 * const effectB = pipe(
 *   TE.left('error'),
 *   TE.tapIO((value) => Console.log(`Hello, ${value}`))
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effectA(), E.of(1))
 *   assert.deepStrictEqual(await effectB(), E.left('error'))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export const tapIO: {
  <A, _>(f: (a: A) => IO<_>): <E>(self: TaskEither<E, A>) => TaskEither<E, A>
  <E, A, _>(self: TaskEither<E, A>, f: (a: A) => IO<_>): TaskEither<E, A>
} = /*#__PURE__*/ dual(2, tapIO_(FromIO, Chain))

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as TE from 'fp-ts/TaskEither'
 * import * as T from 'fp-ts/Task'
 * import * as E from 'fp-ts/Either'
 *
 *
 * const effect = TE.tapIO(
 *   TE.of(1),
 *   (value) => T.of(value + 1)
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect(), E.of(1))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
export const tapTask: {
  <A, _>(f: (a: A) => Task<_>): <E>(self: TaskEither<E, A>) => TaskEither<E, A>
  <E, A, _>(self: TaskEither<E, A>, f: (a: A) => Task<_>): TaskEither<E, A>
} = /*#__PURE__*/ dual(2, tapTask_(FromTask, Chain))

/**
 * @category instances
 * @since 2.7.0
 */
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  bimap: mapBoth,
  mapLeft: mapError
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Alt: Alt2<URI> = {
  URI,
  map: _map,
  alt: _alt
}

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromOption: <E>(onNone: LazyArg<E>) => <A>(fa: Option<A>) => TaskEither<E, A> =
  /*#__PURE__*/ fromOption_(FromEither)

/**
 * Use `liftOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const fromOptionK: <E>(
  onNone: LazyArg<E>
) => <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Option<B>) => (...a: A) => TaskEither<E, B> =
  /*#__PURE__*/ fromOptionK_(FromEither)

/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainOptionK: <E>(
  onNone: LazyArg<E>
) => <A, B>(f: (a: A) => Option<B>) => (ma: TaskEither<E, A>) => TaskEither<E, B> = /*#__PURE__*/ chainOptionK_(
  FromEither,
  Chain
)

/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.13.2
 */
export const chainOptionKW: <E2>(
  onNone: LazyArg<E2>
) => <A, B>(f: (a: A) => Option<B>) => <E1>(ma: TaskEither<E1, A>) => TaskEither<E1 | E2, B> = chainOptionK as any

/** @internal */
interface TaskEitherTypeLambda extends _.TypeLambda {
  readonly type: TaskEither<this['Out1'], this['Target']>
}

/** @internal */
const _FromEither: _.FromEither<TaskEitherTypeLambda> = {
  fromEither: FromEither.fromEither
}

/**
 * @category lifting
 * @since 2.15.0
 */
export const liftNullable: <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => B | null | undefined,
  onNullable: (...a: A) => E
) => (...a: A) => TaskEither<E, NonNullable<B>> = /*#__PURE__*/ _.liftNullable(_FromEither)

/**
 * @category lifting
 * @since 2.15.0
 */
export const liftOption: <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => Option<B>,
  onNone: (...a: A) => E
) => (...a: A) => TaskEither<E, B> = /*#__PURE__*/ _.liftOption(_FromEither)

/** @internal */
const _FlatMap: _.FlatMap<TaskEitherTypeLambda> = {
  flatMap
}

/** @internal */
const _FromIO: _.FromIO<TaskEitherTypeLambda> = {
  fromIO: FromIO.fromIO
}

/** @internal */
const _FromTask: _.FromTask<TaskEitherTypeLambda> = {
  fromTask
}

/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapNullable: {
  <A, B, E2>(f: (a: A) => B | null | undefined, onNullable: (a: A) => E2): <E1>(
    self: TaskEither<E1, A>
  ) => TaskEither<E2 | E1, NonNullable<B>>
  <E1, A, B, E2>(self: TaskEither<E1, A>, f: (a: A) => B | null | undefined, onNullable: (a: A) => E2): TaskEither<
    E1 | E2,
    NonNullable<B>
  >
} = /*#__PURE__*/ _.flatMapNullable(_FromEither, _FlatMap)

/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapOption: {
  <A, B, E2>(f: (a: A) => Option<B>, onNone: (a: A) => E2): <E1>(self: TaskEither<E1, A>) => TaskEither<E2 | E1, B>
  <E1, A, B, E2>(self: TaskEither<E1, A>, f: (a: A) => Option<B>, onNone: (a: A) => E2): TaskEither<E1 | E2, B>
} = /*#__PURE__*/ _.flatMapOption(_FromEither, _FlatMap)

/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapEither: {
  <A, E2, B>(f: (a: A) => E.Either<E2, B>): <E1>(self: TaskEither<E1, A>) => TaskEither<E1 | E2, B>
  <E1, A, E2, B>(self: TaskEither<E1, A>, f: (a: A) => E.Either<E2, B>): TaskEither<E1 | E2, B>
} = /*#__PURE__*/ _.flatMapEither(_FromEither, _FlatMap)

/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapIO: {
  <A, B>(f: (a: A) => IO<B>): <E>(self: TaskEither<E, A>) => TaskEither<E, B>
  <E, A, B>(self: TaskEither<E, A>, f: (a: A) => IO<B>): TaskEither<E, B>
} = /*#__PURE__*/ _.flatMapIO(_FromIO, _FlatMap)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapTask: {
  <A, B>(f: (a: A) => Task<B>): <E>(self: TaskEither<E, A>) => TaskEither<E, B>
  <E, A, B>(self: TaskEither<E, A>, f: (a: A) => Task<B>): TaskEither<E, B>
} = /*#__PURE__*/ _.flatMapTask(_FromTask, _FlatMap)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapIOEither: {
  <A, E2, B>(f: (a: A) => IOEither<E2, B>): <E1>(self: TaskEither<E1, A>) => TaskEither<E1 | E2, B>
  <E1, A, E2, B>(self: TaskEither<E1, A>, f: (a: A) => IOEither<E2, B>): TaskEither<E1 | E2, B>
} = /*#__PURE__*/ dual(
  2,
  <E1, A, E2, B>(self: TaskEither<E1, A>, f: (a: A) => IOEither<E2, B>): TaskEither<E1 | E2, B> =>
    flatMap(self, fromIOEitherK(f))
)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapTaskOption: {
  <A, E2, B>(f: (a: A) => TaskOption<B>, onNone: (a: A) => E2): <E1>(self: TaskEither<E1, A>) => TaskEither<E1 | E2, B>
  <E1, A, E2, B>(self: TaskEither<E1, A>, f: (a: A) => TaskOption<B>, onNone: (a: A) => E2): TaskEither<E1 | E2, B>
} = /*#__PURE__*/ dual(
  3,
  <E1, A, E2, B>(self: TaskEither<E1, A>, f: (a: A) => TaskOption<B>, onNone: (a: A) => E2): TaskEither<E1 | E2, B> =>
    flatMap(self, (a) => fromTaskOption(() => onNone(a))(f(a)))
)

/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export const chainEitherK: <E, A, B>(f: (a: A) => E.Either<E, B>) => (ma: TaskEither<E, A>) => TaskEither<E, B> =
  flatMapEither

/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.6.1
 */
export const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <E1>(ma: TaskEither<E1, A>) => TaskEither<E1 | E2, B> = flatMapEither

/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainFirstEitherK: <A, E, B>(f: (a: A) => E.Either<E, B>) => (ma: TaskEither<E, A>) => TaskEither<E, A> =
  tapEither

/**
 * Alias of `tapEither`.
 *
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainFirstEitherKW: <A, E2, B>(
  f: (a: A) => E.Either<E2, B>
) => <E1>(ma: TaskEither<E1, A>) => TaskEither<E1 | E2, A> = tapEither

/**
 * @category lifting
 * @since 2.0.0
 */
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => TaskEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <B extends A>(b: B) => TaskEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => TaskEither<E, A>
} = /*#__PURE__*/ fromPredicate_(FromEither)

/**
 * @category filtering
 * @since 2.0.0
 */
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: TaskEither<E, A>) => TaskEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <B extends A>(mb: TaskEither<E, B>) => TaskEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: TaskEither<E, A>) => TaskEither<E, A>
} = /*#__PURE__*/ filterOrElse_(FromEither, Chain)

/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category filtering
 * @since 2.9.0
 */
export const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <E1>(
    ma: TaskEither<E1, A>
  ) => TaskEither<E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <E1, B extends A>(
    mb: TaskEither<E1, B>
  ) => TaskEither<E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <E1>(ma: TaskEither<E1, A>) => TaskEither<E1 | E2, A>
} = filterOrElse

/**
 * @category lifting
 * @since 2.4.0
 */
export const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => (...a: A) => TaskEither<E, B> = /*#__PURE__*/ fromEitherK_(FromEither)

/**
 * @category lifting
 * @since 2.10.0
 */
export const fromIOK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>
) => <E = never>(...a: A) => TaskEither<E, B> = /*#__PURE__*/ fromIOK_(FromIO)

/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainIOK: <A, B>(f: (a: A) => IO<B>) => <E>(first: TaskEither<E, A>) => TaskEither<E, B> = flatMapIO

/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainFirstIOK: <A, B>(f: (a: A) => IO<B>) => <E>(first: TaskEither<E, A>) => TaskEither<E, A> = tapIO

/**
 * @category lifting
 * @since 2.10.0
 */
export const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => T.Task<B>
) => <E = never>(...a: A) => TaskEither<E, B> = /*#__PURE__*/ fromTaskK_(FromTask)

/**
 * Alias of `flatMapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainTaskK: <A, B>(f: (a: A) => T.Task<B>) => <E>(first: TaskEither<E, A>) => TaskEither<E, B> =
  flatMapTask

/**
 * Alias of `tapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainFirstTaskK: <A, B>(f: (a: A) => T.Task<B>) => <E>(first: TaskEither<E, A>) => TaskEither<E, A> =
  tapTask

/**
 * Alias of `flatMapIOEither`.
 *
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.6.1
 */
export const chainIOEitherKW: <E2, A, B>(
  f: (a: A) => IOEither<E2, B>
) => <E1>(ma: TaskEither<E1, A>) => TaskEither<E1 | E2, B> = flatMapIOEither

/**
 * Alias of `flatMapIOEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export const chainIOEitherK: <E, A, B>(f: (a: A) => IOEither<E, B>) => (ma: TaskEither<E, A>) => TaskEither<E, B> =
  flatMapIOEither

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * Convert a node style callback function to one returning a `TaskEither`
 *
 * **Note**. If the function `f` admits multiple overloadings, `taskify` will pick last one. If you want a different
 * behaviour, add an explicit type annotation
 *
 * ```ts
 * // readFile admits multiple overloadings
 *
 * // const readFile: (a: string) => TaskEither<NodeJS.ErrnoException, Buffer>
 * const readFile = taskify(fs.readFile)
 *
 * const readFile2: (filename: string, encoding: string) => TaskEither<NodeJS.ErrnoException, Buffer> = taskify(
 *   fs.readFile
 * )
 * ```
 *
 * @example
 * import { taskify } from 'fp-ts/TaskEither'
 * import * as fs from 'fs'
 *
 * // const stat: (a: string | Buffer) => TaskEither<NodeJS.ErrnoException, fs.Stats>
 * const stat = taskify(fs.stat)
 * assert.strictEqual(stat.length, 0)
 *
 * @category interop
 * @since 2.0.0
 */
export function taskify<L, R>(f: (cb: (e: L | null | undefined, r?: R) => void) => void): () => TaskEither<L, R>
export function taskify<A, L, R>(
  f: (a: A, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A) => TaskEither<L, R>
export function taskify<A, B, L, R>(
  f: (a: A, b: B, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A, b: B) => TaskEither<L, R>
export function taskify<A, B, C, L, R>(
  f: (a: A, b: B, c: C, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A, b: B, c: C) => TaskEither<L, R>
export function taskify<A, B, C, D, L, R>(
  f: (a: A, b: B, c: C, d: D, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A, b: B, c: C, d: D) => TaskEither<L, R>
export function taskify<A, B, C, D, E, L, R>(
  f: (a: A, b: B, c: C, d: D, e: E, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A, b: B, c: C, d: D, e: E) => TaskEither<L, R>
export function taskify<L, R>(f: Function): () => TaskEither<L, R> {
  return function () {
    const args = Array.prototype.slice.call(arguments)
    return () =>
      new Promise((resolve) => {
        const cbResolver = (e: L, r: R) => (e != null ? resolve(_.left(e)) : resolve(_.right(r)))
        f.apply(null, args.concat(cbResolver))
      })
  }
}

/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
export const bracket = <E, A, B>(
  acquire: TaskEither<E, A>,
  use: (a: A) => TaskEither<E, B>,
  release: (a: A, e: Either<E, B>) => TaskEither<E, void>
): TaskEither<E, B> => bracketW(acquire, use, release)

/**
 * Less strict version of [`bracket`](#bracket).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
export const bracketW: <E1, A, E2, B, E3>(
  acquire: TaskEither<E1, A>,
  use: (a: A) => TaskEither<E2, B>,
  release: (a: A, e: E.Either<E2, B>) => TaskEither<E3, void>
) => TaskEither<E1 | E2 | E3, B> = (acquire, use, release) =>
  flatMap(acquire, (a) => T.flatMap(use(a), (e) => flatMap(release(a, e), () => T.of(e))))

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @category do notation
 * @since 2.9.0
 */
export const Do: TaskEither<never, {}> = /*#__PURE__*/ of(_.emptyRecord)

/**
 * @category do notation
 * @since 2.8.0
 */
export const bindTo = /*#__PURE__*/ bindTo_(Functor)

const let_ = /*#__PURE__*/ let__(Functor)

export {
  /**
   * @category do notation
   * @since 2.13.0
   */
  let_ as let
}

/**
 * @category do notation
 * @since 2.8.0
 */
export const bind = /*#__PURE__*/ chainable.bind(Chain)

/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export const bindW: <N extends string, A, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => TaskEither<E2, B>
) => <E1>(fa: TaskEither<E1, A>) => TaskEither<E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> =
  bind as any

/**
 * @category do notation
 * @since 2.8.0
 */
export const apS = /*#__PURE__*/ apS_(ApplyPar)

/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export const apSW: <A, N extends string, E2, B>(
  name: Exclude<N, keyof A>,
  fb: TaskEither<E2, B>
) => <E1>(fa: TaskEither<E1, A>) => TaskEither<E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> =
  apS as any

/**
 * @since 2.11.0
 */
export const ApT: TaskEither<never, readonly []> = /*#__PURE__*/ of(_.emptyReadonlyArray)

// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------

/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = <A, E, B>(
  f: (index: number, a: A) => TaskEither<E, B>
): ((as: ReadonlyNonEmptyArray<A>) => TaskEither<E, ReadonlyNonEmptyArray<B>>) =>
  flow(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(E.traverseReadonlyNonEmptyArrayWithIndex(SK)))

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndex = <A, E, B>(
  f: (index: number, a: A) => TaskEither<E, B>
): ((as: ReadonlyArray<A>) => TaskEither<E, ReadonlyArray<B>>) => {
  const g = traverseReadonlyNonEmptyArrayWithIndex(f)
  return (as) => (_.isNonEmpty(as) ? g(as) : ApT)
}

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndexSeq =
  <A, E, B>(f: (index: number, a: A) => TaskEither<E, B>) =>
  (as: ReadonlyNonEmptyArray<A>): TaskEither<E, ReadonlyNonEmptyArray<B>> =>
  () =>
    _.tail(as).reduce<Promise<Either<E, NonEmptyArray<B>>>>(
      (acc, a, i) =>
        acc.then((ebs) =>
          _.isLeft(ebs)
            ? acc
            : f(i + 1, a)().then((eb) => {
                if (_.isLeft(eb)) {
                  return eb
                }
                ebs.right.push(eb.right)
                return ebs
              })
        ),
      f(0, _.head(as))().then(E.map(_.singleton))
    )

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndexSeq = <A, E, B>(
  f: (index: number, a: A) => TaskEither<E, B>
): ((as: ReadonlyArray<A>) => TaskEither<E, ReadonlyArray<B>>) => {
  const g = traverseReadonlyNonEmptyArrayWithIndexSeq(f)
  return (as) => (_.isNonEmpty(as) ? g(as) : ApT)
}

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArrayWithIndex: <A, B, E>(
  f: (index: number, a: A) => TaskEither<E, B>
) => (as: ReadonlyArray<A>) => TaskEither<E, ReadonlyArray<B>> = traverseReadonlyArrayWithIndex

/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArray = <A, B, E>(
  f: (a: A) => TaskEither<E, B>
): ((as: ReadonlyArray<A>) => TaskEither<E, ReadonlyArray<B>>) => traverseReadonlyArrayWithIndex((_, a) => f(a))

/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const sequenceArray: <A, E>(arr: ReadonlyArray<TaskEither<E, A>>) => TaskEither<E, ReadonlyArray<A>> =
  /*#__PURE__*/ traverseArray(identity)

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseSeqArrayWithIndex: <A, B, E>(
  f: (index: number, a: A) => TaskEither<E, B>
) => (as: ReadonlyArray<A>) => TaskEither<E, ReadonlyArray<B>> = traverseReadonlyArrayWithIndexSeq

/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseSeqArray = <A, B, E>(
  f: (a: A) => TaskEither<E, B>
): ((as: ReadonlyArray<A>) => TaskEither<E, ReadonlyArray<B>>) => traverseReadonlyArrayWithIndexSeq((_, a) => f(a))

/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const sequenceSeqArray: <A, E>(arr: ReadonlyArray<TaskEither<E, A>>) => TaskEither<E, ReadonlyArray<A>> =
  /*#__PURE__*/ traverseSeqArray(identity)

// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------

/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chain: <E, A, B>(f: (a: A) => TaskEither<E, B>) => (ma: TaskEither<E, A>) => TaskEither<E, B> = flatMap

/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
export const chainW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <E1>(ma: TaskEither<E1, A>) => TaskEither<E1 | E2, B> = flatMap

/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chainFirst: <E, A, B>(f: (a: A) => TaskEither<E, B>) => (ma: TaskEither<E, A>) => TaskEither<E, A> = tap

/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
export const chainFirstW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <E1>(ma: TaskEither<E1, A>) => TaskEither<E1 | E2, A> = tap

/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const orElseFirst: <E, B>(onLeft: (e: E) => TaskEither<E, B>) => <A>(ma: TaskEither<E, A>) => TaskEither<E, A> =
  tapError

/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const orElseFirstW: <E1, E2, B>(
  onLeft: (e: E1) => TaskEither<E2, B>
) => <A>(ma: TaskEither<E1, A>) => TaskEither<E1 | E2, A> = tapError

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEither`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const taskEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadTask2<URI> & MonadThrow2<URI> = {
  URI,
  bimap: mapBoth,
  mapLeft: mapError,
  map: _map,
  of,
  ap: _apPar,
  chain: flatMap,
  alt: _alt,
  fromIO,
  fromTask,
  throwError
}

/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEitherSeq`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */

export const taskEitherSeq: typeof taskEither = {
  URI,
  bimap: mapBoth,
  mapLeft: mapError,
  map: _map,
  of,
  ap: _apSeq,
  chain: flatMap,
  alt: _alt,
  fromIO,
  fromTask,
  throwError
}

/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getApplySemigroup: <E, A>(S: Semigroup<A>) => Semigroup<TaskEither<E, A>> =
  /*#__PURE__*/ getApplySemigroup_(ApplySeq)

/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getApplyMonoid: <E, A>(M: Monoid<A>) => Monoid<TaskEither<E, A>> =
  /*#__PURE__*/ getApplicativeMonoid(ApplicativeSeq)

/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getSemigroup = <E, A>(S: Semigroup<A>): Semigroup<TaskEither<E, A>> =>
  getApplySemigroup_(T.ApplySeq)(E.getSemigroup(S))

/**
 * Use [`getApplicativeTaskValidation`](#getapplicativetaskvalidation) and [`getAltTaskValidation`](#getalttaskvalidation) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export function getTaskValidation<E>(
  SE: Semigroup<E>
): Monad2C<URI, E> & Bifunctor2<URI> & Alt2C<URI, E> & MonadTask2C<URI, E> & MonadThrow2C<URI, E> {
  const applicativeTaskValidation = getApplicativeTaskValidation(T.ApplicativePar, SE)
  const altTaskValidation = getAltTaskValidation(SE)
  return {
    URI,
    _E: undefined as any,
    map: _map,
    ap: applicativeTaskValidation.ap,
    of,
    chain: flatMap,
    bimap: mapBoth,
    mapLeft: mapError,
    alt: altTaskValidation.alt,
    fromIO,
    fromTask,
    throwError
  }
}
