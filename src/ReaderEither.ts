/**
 * @since 2.0.0
 */
import { Alt3, Alt3C } from './Alt.js'
import { Applicative3, Applicative3C, getApplicativeMonoid } from './Applicative.js'
import {
  ap as ap_,
  apFirst as apFirst_,
  Apply3,
  apS as apS_,
  apSecond as apSecond_,
  getApplySemigroup as getApplySemigroup_
} from './Apply.js'
import { Bifunctor3 } from './Bifunctor.js'
import * as chainable from './Chain.js'
import { compact as compact_, Compactable3C, separate as separate_ } from './Compactable.js'
import * as E from './Either.js'
import * as ET from './EitherT.js'
import {
  filter as filter_,
  Filterable3C,
  filterMap as filterMap_,
  partition as partition_,
  partitionMap as partitionMap_
} from './Filterable.js'
import {
  chainOptionK as chainOptionK_,
  filterOrElse as filterOrElse_,
  FromEither3,
  fromEitherK as fromEitherK_,
  fromOption as fromOption_,
  fromOptionK as fromOptionK_,
  fromPredicate as fromPredicate_,
  tapEither as tapEither_
} from './FromEither.js'
import {
  ask as ask_,
  asks as asks_,
  FromReader3,
  fromReaderK as fromReaderK_,
  tapReader as tapReader_
} from './FromReader.js'
import { dual, flow, identity, LazyArg, pipe, SK } from './function.js'
import { as as as_, asUnit as asUnit_, bindTo as bindTo_, flap as flap_, Functor3, let as let__ } from './Functor.js'
import * as _ from './internal.js'
import { Monad3, Monad3C } from './Monad.js'
import { MonadThrow3, MonadThrow3C } from './MonadThrow.js'
import { Monoid } from './Monoid.js'
import { Option } from './Option.js'
import { Pointed3 } from './Pointed.js'
import { Predicate } from './Predicate.js'
import * as R from './Reader.js'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray.js'
import { Refinement } from './Refinement.js'
import { Semigroup } from './Semigroup.js'

import Reader = R.Reader
import Either = E.Either

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 2.0.0
 */
export interface ReaderEither<R, E, A> extends Reader<R, Either<E, A>> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.0.0
 */
export const left: <R, E = never, A = never>(e: E) => ReaderEither<R, E, A> = /*#__PURE__*/ ET.left(R.Pointed)

/**
 * @category constructors
 * @since 2.0.0
 */
export const right: <R, E = never, A = never>(a: A) => ReaderEither<R, E, A> = /*#__PURE__*/ ET.right(R.Pointed)

/**
 * @category constructors
 * @since 2.0.0
 */
export const rightReader: <R, E = never, A = never>(ma: Reader<R, A>) => ReaderEither<R, E, A> =
  /*#__PURE__*/ ET.rightF(R.Functor)

/**
 * @category constructors
 * @since 2.0.0
 */
export const leftReader: <R, E = never, A = never>(me: Reader<R, E>) => ReaderEither<R, E, A> = /*#__PURE__*/ ET.leftF(
  R.Functor
)

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromEither: <E, A, R = unknown>(fa: Either<E, A>) => ReaderEither<R, E, A> = R.of

/**
 * @category conversions
 * @since 2.11.0
 */
export const fromReader: <R, A, E = never>(fa: Reader<R, A>) => ReaderEither<R, E, A> = rightReader

/**
 * @category pattern matching
 * @since 2.10.0
 */
export const match: <E, B, A>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B
) => <R>(ma: ReaderEither<R, E, A>) => Reader<R, B> = /*#__PURE__*/ ET.match(R.Functor)

/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchW: <E, B, A, C>(
  onLeft: (e: E) => B,
  onRight: (a: A) => C
) => <R>(ma: Reader<R, Either<E, A>>) => Reader<R, B | C> = match as any

/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Reader`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchE: <R, E, A, B>(
  onLeft: (e: E) => Reader<R, B>,
  onRight: (a: A) => Reader<R, B>
) => (ma: ReaderEither<R, E, A>) => Reader<R, B> = /*#__PURE__*/ ET.matchE(R.Monad)

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
export const matchEW: <E, R2, B, A, R3, C>(
  onLeft: (e: E) => Reader<R2, B>,
  onRight: (a: A) => Reader<R3, C>
) => <R1>(ma: ReaderEither<R1, E, A>) => Reader<R1 & R2 & R3, B | C> = matchE as any

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
export const getOrElse: <E, R, A>(onLeft: (e: E) => Reader<R, A>) => (ma: ReaderEither<R, E, A>) => Reader<R, A> =
  /*#__PURE__*/ ET.getOrElse(R.Monad)

/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
export const getOrElseW: <R2, E, B>(
  onLeft: (e: E) => Reader<R2, B>
) => <R1, A>(ma: ReaderEither<R1, E, A>) => Reader<R1 & R2, A | B> = getOrElse as any

/**
 * @category conversions
 * @since 2.10.0
 */
export const toUnion: <R, E, A>(fa: ReaderEither<R, E, A>) => Reader<R, E | A> = /*#__PURE__*/ ET.toUnion(R.Functor)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.0.0
 */
export const local: <R2, R1>(f: (r2: R2) => R1) => <E, A>(ma: ReaderEither<R1, E, A>) => ReaderEither<R2, E, A> =
  R.local

/**
 * Less strict version of [`asksReaderEither`](#asksreadereither).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReaderEitherW: <R1, R2, E, A>(f: (r1: R1) => ReaderEither<R2, E, A>) => ReaderEither<R1 & R2, E, A> =
  R.asksReaderW

/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReaderEither: <R, E, A>(f: (r: R) => ReaderEither<R, E, A>) => ReaderEither<R, E, A> =
  asksReaderEitherW

/**
 * @category error handling
 * @since 2.0.0
 */
export const orElse: <E1, R, E2, A>(
  onLeft: (e: E1) => ReaderEither<R, E2, A>
) => (ma: ReaderEither<R, E1, A>) => ReaderEither<R, E2, A> = /*#__PURE__*/ ET.orElse(R.Monad)

/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
export const orElseW: <E1, R1, E2, B>(
  onLeft: (e: E1) => ReaderEither<R1, E2, B>
) => <R2, A>(ma: ReaderEither<R2, E1, A>) => ReaderEither<R1 & R2, E2, A | B> = orElse as any

/**
 * Returns an effect that effectfully "peeks" at the failure of this effect.
 *
 * @category error handling
 * @since 2.15.0
 */
export const tapError: {
  <E1, R2, E2, _>(onLeft: (e: E1) => ReaderEither<R2, E2, _>): <R1, A>(
    self: ReaderEither<R1, E1, A>
  ) => ReaderEither<R1 & R2, E1 | E2, A>
  <R1, E1, A, R2, E2, _>(self: ReaderEither<R1, E1, A>, onLeft: (e: E1) => ReaderEither<R2, E2, _>): ReaderEither<
    R1 & R2,
    E1 | E2,
    A
  >
} = /*#__PURE__*/ dual(2, ET.tapError(R.Monad))

/**
 * @category error handling
 * @since 2.11.0
 */
export const orLeft: <E1, R, E2>(
  onLeft: (e: E1) => Reader<R, E2>
) => <A>(fa: ReaderEither<R, E1, A>) => ReaderEither<R, E2, A> = /*#__PURE__*/ ET.orLeft(R.Monad)

/**
 * @category error handling
 * @since 2.16.6
 */
export const orLeftW: <E1, R2, E2>(
  onLeft: (e: E1) => Reader<R2, E2>
) => <R1, A>(fa: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E2, A> = orLeft as any

/**
 * @since 2.0.0
 */
export const swap: <R, E, A>(ma: ReaderEither<R, E, A>) => ReaderEither<R, A, E> = /*#__PURE__*/ ET.swap(R.Functor)

/* istanbul ignore next */
const _map: Monad3<URI>['map'] = (fa, f) => pipe(fa, map(f))
/* istanbul ignore next */
const _ap: Monad3<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const _alt: Alt3<URI>['alt'] = (fa, that) => pipe(fa, alt(that))

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map: <A, B>(f: (a: A) => B) => <R, E>(fa: ReaderEither<R, E, A>) => ReaderEither<R, E, B> =
  /*#__PURE__*/ ET.map(R.Functor)

/**
 * Returns a `ReaderEither` whose failure and success channels have been mapped by the specified pair of functions, `f` and `g`.
 *
 * @example
 * import * as ReaderEither from 'fp-ts/ReaderEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 * const g = (n: number) => n * 2
 *
 * assert.deepStrictEqual(ReaderEither.mapBoth(ReaderEither.right(1), f, g)({}), Either.right(2))
 * assert.deepStrictEqual(ReaderEither.mapBoth(ReaderEither.left('err'), f, g)({}), Either.left(new Error('err')))
 *
 * @category error handling
 * @since 2.16.0
 */
export const mapBoth: {
  <E, G, A, B>(f: (e: E) => G, g: (a: A) => B): <R>(self: ReaderEither<R, E, A>) => ReaderEither<R, G, B>
  <R, E, A, G, B>(self: ReaderEither<R, E, A>, f: (e: E) => G, g: (a: A) => B): ReaderEither<R, G, B>
} = /*#__PURE__*/ dual(3, ET.mapBoth(R.Functor))

/**
 * Alias of `mapBoth`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <R>(fa: ReaderEither<R, E, A>) => ReaderEither<R, G, B> = mapBoth

/**
 * Returns a `ReaderEither` with its error channel mapped using the specified function.
 *
 * @example
 * import * as ReaderEither from 'fp-ts/ReaderEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 *
 * assert.deepStrictEqual(ReaderEither.mapError(ReaderEither.right(1), f)({}), Either.right(1))
 * assert.deepStrictEqual(ReaderEither.mapError(ReaderEither.left('err'), f)({}), Either.left(new Error('err')))
 *
 * @category error handling
 * @since 2.16.0
 */
export const mapError: {
  <R, E, G>(f: (e: E) => G): <A>(self: ReaderEither<R, E, A>) => ReaderEither<R, G, A>
  <R, E, A, G>(self: ReaderEither<R, E, A>, f: (e: E) => G): ReaderEither<R, G, A>
} = /*#__PURE__*/ dual(2, ET.mapError(R.Functor))

/**
 * Alias of `mapError`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const mapLeft: <E, G>(f: (e: E) => G) => <R, A>(fa: ReaderEither<R, E, A>) => ReaderEither<R, G, A> = mapError

/**
 * @since 2.0.0
 */
export const ap: <R, E, A>(
  fa: ReaderEither<R, E, A>
) => <B>(fab: ReaderEither<R, E, (a: A) => B>) => ReaderEither<R, E, B> = /*#__PURE__*/ ET.ap(R.Apply)

/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
export const apW: <R2, E2, A>(
  fa: ReaderEither<R2, E2, A>
) => <R1, E1, B>(fab: ReaderEither<R1, E1, (a: A) => B>) => ReaderEither<R1 & R2, E1 | E2, B> = ap as any

/**
 * @category constructors
 * @since 2.8.5
 */
export const of: <R = unknown, E = never, A = never>(a: A) => ReaderEither<R, E, A> = right

/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap: {
  <A, R2, E2, B>(f: (a: A) => ReaderEither<R2, E2, B>): <R1, E1>(
    ma: ReaderEither<R1, E1, A>
  ) => ReaderEither<R1 & R2, E1 | E2, B>
  <R1, E1, A, R2, E2, B>(ma: ReaderEither<R1, E1, A>, f: (a: A) => ReaderEither<R2, E2, B>): ReaderEither<
    R1 & R2,
    E1 | E2,
    B
  >
} = /*#__PURE__*/ dual(2, ET.flatMap(R.Monad))

/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const flattenW: <R1, R2, E1, E2, A>(
  mma: ReaderEither<R1, E1, ReaderEither<R2, E2, A>>
) => ReaderEither<R1 & R2, E1 | E2, A> = /*#__PURE__*/ flatMap(identity)

/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten: <R, E, A>(mma: ReaderEither<R, E, ReaderEither<R, E, A>>) => ReaderEither<R, E, A> = flattenW

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.0.0
 */
export const alt: <R, E, A>(that: () => ReaderEither<R, E, A>) => (fa: ReaderEither<R, E, A>) => ReaderEither<R, E, A> =
  /*#__PURE__*/ ET.alt(R.Monad)

/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the environment, the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW: <R2, E2, B>(
  that: () => ReaderEither<R2, E2, B>
) => <R1, E1, A>(fa: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E2, A | B> = alt as any

/**
 * @since 2.7.0
 */
export const throwError: MonadThrow3<URI>['throwError'] = left

/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'ReaderEither'

/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI

declare module './HKT' {
  interface URItoKind3<R, E, A> {
    readonly [URI]: ReaderEither<R, E, A>
  }
}

/**
 * @category filtering
 * @since 2.10.0
 */
export const getCompactable = <E>(M: Monoid<E>): Compactable3C<URI, E> => {
  const C = E.getCompactable(M)
  return {
    URI,
    _E: undefined as any,
    compact: compact_(R.Functor, C),
    separate: separate_(R.Functor, C, E.Functor)
  }
}

/**
 * @category filtering
 * @since 2.10.0
 */
export function getFilterable<E>(M: Monoid<E>): Filterable3C<URI, E> {
  const F = E.getFilterable(M)
  const C = getCompactable(M)

  const filter = filter_(R.Functor, F)
  const filterMap = filterMap_(R.Functor, F)
  const partition = partition_(R.Functor, F)
  const partitionMap = partitionMap_(R.Functor, F)
  return {
    URI,
    _E: undefined as any,
    map: _map,
    compact: C.compact,
    separate: C.separate,
    filter: <R, A>(fa: ReaderEither<R, E, A>, predicate: Predicate<A>) => pipe(fa, filter(predicate)),
    filterMap: (fa, f) => pipe(fa, filterMap(f)),
    partition: <R, A>(fa: ReaderEither<R, E, A>, predicate: Predicate<A>) => pipe(fa, partition(predicate)),
    partitionMap: (fa, f) => pipe(fa, partitionMap(f))
  }
}

/**
 * The default [`Applicative`](#applicative) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getApplicativeValidation`](./Either.ts.html#getapplicativevalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
export function getApplicativeReaderValidation<E>(S: Semigroup<E>): Applicative3C<URI, E> {
  const ap = ap_(R.Apply, E.getApplicativeValidation(S))
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
export function getAltReaderValidation<E>(S: Semigroup<E>): Alt3C<URI, E> {
  const alt = ET.altValidation(R.Monad, S)
  return {
    URI,
    _E: undefined as any,
    map: _map,
    alt: (fa, that) => pipe(fa, alt(that))
  }
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Functor: Functor3<URI> = {
  URI,
  map: _map
}

/**
 * Maps the `Right` value of this `ReaderEither` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export const as: {
  <A>(a: A): <R, E, _>(self: ReaderEither<R, E, _>) => ReaderEither<R, E, A>
  <R, E, _, A>(self: ReaderEither<R, E, _>, a: A): ReaderEither<R, E, A>
} = dual(2, as_(Functor))

/**
 * Maps the `Right` value of this `ReaderEither` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export const asUnit: <R, E, _>(self: ReaderEither<R, E, _>) => ReaderEither<R, E, void> = asUnit_(Functor)

/**
 * @category mapping
 * @since 2.10.0
 */
export const flap = /*#__PURE__*/ flap_(Functor)

/**
 * @category instances
 * @since 2.10.0
 */
export const Pointed: Pointed3<URI> = {
  URI,
  of
}

/**
 * @category instances
 * @since 2.10.0
 */
export const Apply: Apply3<URI> = {
  URI,
  map: _map,
  ap: _ap
}

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
export const apFirst = /*#__PURE__*/ apFirst_(Apply)

/**
 * Less strict version of [`apFirst`](#apfirst)
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
export const apFirstW: <R2, E2, B>(
  second: ReaderEither<R2, E2, B>
) => <R1, E1, A>(first: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, A> = apFirst as any

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export const apSecond = /*#__PURE__*/ apSecond_(Apply)

/**
 * Less strict version of [`apSecond`](#apsecond)
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
export const apSecondW: <R2, E2, B>(
  second: ReaderEither<R2, E2, B>
) => <R1, E1, A>(first: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, B> = apSecond as any

/**
 * @category instances
 * @since 2.7.0
 */
export const Applicative: Applicative3<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of
}

/**
 * @category instances
 * @since 2.10.0
 */
export const Chain: chainable.Chain3<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: flatMap
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Monad: Monad3<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: flatMap
}

/**
 * @category instances
 * @since 2.10.0
 */
export const FromEither: FromEither3<URI> = {
  URI,
  fromEither
}

/**
 * @category instances
 * @since 2.11.0
 */
export const FromReader: FromReader3<URI> = {
  URI,
  fromReader
}

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export const tap: {
  <R1, E1, A, R2, E2, _>(self: ReaderEither<R1, E1, A>, f: (a: A) => ReaderEither<R2, E2, _>): ReaderEither<
    R1 & R2,
    E1 | E2,
    A
  >
  <A, R2, E2, _>(f: (a: A) => ReaderEither<R2, E2, _>): <R1, E1>(
    self: ReaderEither<R1, E1, A>
  ) => ReaderEither<R1 & R2, E2 | E1, A>
} = /*#__PURE__*/ dual(2, chainable.tap(Chain))

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as RE from 'fp-ts/ReaderEither'
 *
 * const checkString = (value: string) => pipe(
 *   RE.ask<number>(),
 *   RE.tapEither(
 *     (minLength) => value.length > minLength
 *       ? E.right('ok')
 *       : E.left('error')
 *   )
 * )
 *
 * assert.deepStrictEqual(checkString('')(1), E.left('error'))
 * assert.deepStrictEqual(checkString('fp-ts')(2), E.right(2))
 *
 * @category combinators
 * @since 2.16.0
 */
export const tapEither: {
  <A, E2, _>(f: (a: A) => Either<E2, _>): <R1, E1>(self: ReaderEither<R1, E1, A>) => ReaderEither<R1, E1 | E2, A>
  <R1, E1, A, E2, _>(self: ReaderEither<R1, E1, A>, f: (a: A) => Either<E2, _>): ReaderEither<R1, E1 | E2, A>
} = /*#__PURE__*/ dual(2, tapEither_(FromEither, Chain))

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export const tapReader: {
  <R2, A, E, _>(f: (a: A) => Reader<R2, _>): <R1>(self: ReaderEither<R1, E, A>) => ReaderEither<R1 & R2, E, A>
  <R1, R2, E, A, _>(self: ReaderEither<R1, E, A>, f: (a: A) => Reader<R2, _>): ReaderEither<R1 & R2, E, A>
} = /*#__PURE__*/ dual(2, tapReader_(FromReader, Chain))

/**
 * @category instances
 * @since 2.7.0
 */
export const Bifunctor: Bifunctor3<URI> = {
  URI,
  bimap: mapBoth,
  mapLeft: mapError
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Alt: Alt3<URI> = {
  URI,
  map: _map,
  alt: _alt
}

/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.0.0
 */
export const ask: <R, E = never>() => ReaderEither<R, E, R> = /*#__PURE__*/ ask_(FromReader)

/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.0.0
 */
export const asks: <R, A, E = never>(f: (r: R) => A) => ReaderEither<R, E, A> = /*#__PURE__*/ asks_(FromReader)

/**
 * @category lifting
 * @since 2.11.0
 */
export const fromReaderK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => Reader<R, B>
) => <E = never>(...a: A) => ReaderEither<R, E, B> = /*#__PURE__*/ fromReaderK_(FromReader)

/**
 * Alias of `tapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainFirstReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <E>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A> = tapReader

/**
 * Alias of `tapReader`.
 *
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainFirstReaderKW: <A, R1, B>(
  f: (a: A) => Reader<R1, B>
) => <R2, E>(ma: ReaderEither<R2, E, A>) => ReaderEither<R1 & R2, E, A> = tapReader

/**
 * @category instances
 * @since 2.7.0
 */
export const MonadThrow: MonadThrow3<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: flatMap,
  throwError
}

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromOption: <E>(onNone: LazyArg<E>) => <A, R = unknown>(fa: Option<A>) => ReaderEither<R, E, A> =
  /*#__PURE__*/ fromOption_(FromEither)

/**
 * Use `liftOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const fromOptionK: <E>(
  onNone: LazyArg<E>
) => <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => <R = unknown>(...a: A) => ReaderEither<R, E, B> = /*#__PURE__*/ fromOptionK_(FromEither)

/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainOptionK: <E>(
  onNone: LazyArg<E>
) => <A, B>(f: (a: A) => Option<B>) => <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, B> =
  /*#__PURE__*/ chainOptionK_(FromEither, Chain)

/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.13.2
 */
export const chainOptionKW: <E2>(
  onNone: LazyArg<E2>
) => <A, B>(f: (a: A) => Option<B>) => <R, E1>(ma: ReaderEither<R, E1, A>) => ReaderEither<R, E1 | E2, B> =
  chainOptionK as any

/** @internal */
interface ReaderEitherTypeLambda extends _.TypeLambda {
  readonly type: ReaderEither<this['In'], this['Out1'], this['Target']>
}

/** @internal */
const _FromEither: _.FromEither<ReaderEitherTypeLambda> = {
  fromEither: FromEither.fromEither
}

/** @internal */
const _FromReader: _.FromReader<ReaderEitherTypeLambda> = {
  fromReader: FromReader.fromReader
}

/**
 * @category lifting
 * @since 2.15.0
 */
export const liftNullable: <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => B | null | undefined,
  onNullable: (...a: A) => E
) => <R>(...a: A) => ReaderEither<R, E, NonNullable<B>> = /*#__PURE__*/ _.liftNullable(_FromEither)

/**
 * @category lifting
 * @since 2.15.0
 */
export const liftOption: <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => Option<B>,
  onNone: (...a: A) => E
) => <R>(...a: A) => ReaderEither<R, E, B> = /*#__PURE__*/ _.liftOption(_FromEither)

/** @internal */
const _FlatMap: _.FlatMap<ReaderEitherTypeLambda> = {
  flatMap
}

/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapNullable: {
  <A, B, E2>(f: (a: A) => B | null | undefined, onNullable: (a: A) => E2): <R, E1>(
    self: ReaderEither<R, E1, A>
  ) => ReaderEither<R, E2 | E1, NonNullable<B>>
  <R, E1, A, B, E2>(
    self: ReaderEither<R, E1, A>,
    f: (a: A) => B | null | undefined,
    onNullable: (a: A) => E2
  ): ReaderEither<R, E1 | E2, NonNullable<B>>
} = /*#__PURE__*/ _.flatMapNullable(_FromEither, _FlatMap)

/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapOption: {
  <A, B, E2>(f: (a: A) => Option<B>, onNone: (a: A) => E2): <R, E1>(
    self: ReaderEither<R, E1, A>
  ) => ReaderEither<R, E2 | E1, B>
  <R, E1, A, B, E2>(self: ReaderEither<R, E1, A>, f: (a: A) => Option<B>, onNone: (a: A) => E2): ReaderEither<
    R,
    E1 | E2,
    B
  >
} = /*#__PURE__*/ _.flatMapOption(_FromEither, _FlatMap)

/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapEither: {
  <A, E2, B>(f: (a: A) => E.Either<E2, B>): <R, E1>(self: ReaderEither<R, E1, A>) => ReaderEither<R, E1 | E2, B>
  <R, E1, A, E2, B>(self: ReaderEither<R, E1, A>, f: (a: A) => E.Either<E2, B>): ReaderEither<R, E1 | E2, B>
} = /*#__PURE__*/ _.flatMapEither(_FromEither, _FlatMap)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapReader: {
  <A, R2, B>(f: (a: A) => Reader<R2, B>): <R1, E>(self: ReaderEither<R1, E, A>) => ReaderEither<R1 & R2, E, B>
  <R1, E, A, R2, B>(self: ReaderEither<R1, E, A>, f: (a: A) => Reader<R2, B>): ReaderEither<R1 & R2, E, B>
} = /*#__PURE__*/ _.flatMapReader(_FromReader, _FlatMap)

/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, B> = flatMapEither

/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.6.1
 */
export const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderEither<R, E1, A>) => ReaderEither<R, E1 | E2, B> = flatMapEither

/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainFirstEitherK: <A, E, B>(
  f: (a: A) => E.Either<E, B>
) => <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A> = tapEither

/**
 * Alias of `tapEither`.
 *
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainFirstEitherKW: <A, E2, B>(
  f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderEither<R, E1, A>) => ReaderEither<R, E1 | E2, A> = tapEither

/**
 * Alias of `flatMapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <E>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, B> = flatMapReader

/**
 * Alias of `flatMapReader`.
 *
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainReaderKW: <A, R2, B>(
  f: (a: A) => Reader<R2, B>
) => <R1, E>(ma: ReaderEither<R1, E, A>) => ReaderEither<R1 & R2, E, B> = flatMapReader

/**
 * @category lifting
 * @since 2.0.0
 */
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R = unknown>(a: A) => ReaderEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R = unknown, B extends A = A>(b: B) => ReaderEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R = unknown>(a: A) => ReaderEither<R, E, A>
} = /*#__PURE__*/ fromPredicate_(FromEither)

/**
 * @category filtering
 * @since 2.0.0
 */
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
    ma: ReaderEither<R, E, A>
  ) => ReaderEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R, B extends A>(
    mb: ReaderEither<R, E, B>
  ) => ReaderEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A>
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
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <R, E1>(
    ma: ReaderEither<R, E1, A>
  ) => ReaderEither<R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <R, E1, B extends A>(
    mb: ReaderEither<R, E1, B>
  ) => ReaderEither<R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <R, E1>(
    ma: ReaderEither<R, E1, A>
  ) => ReaderEither<R, E1 | E2, A>
} = filterOrElse

/**
 * @category lifting
 * @since 2.4.0
 */
export const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => <R = unknown>(...a: A) => ReaderEither<R, E, B> = /*#__PURE__*/ fromEitherK_(FromEither)

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @category do notation
 * @since 2.9.0
 */
export const Do: ReaderEither<unknown, never, {}> = /*#__PURE__*/ of(_.emptyRecord)

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
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export const bindW: <N extends string, A, R2, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderEither<R1, E1, A>
) => ReaderEither<R1 & R2, E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> = bind as any

/**
 * @category do notation
 * @since 2.8.0
 */
export const apS = /*#__PURE__*/ apS_(Apply)

/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export const apSW: <A, N extends string, R2, E2, B>(
  name: Exclude<N, keyof A>,
  fb: ReaderEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderEither<R1, E1, A>
) => ReaderEither<R1 & R2, E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> = apS as any

/**
 * @since 2.11.0
 */
export const ApT: ReaderEither<unknown, never, readonly []> = /*#__PURE__*/ of(_.emptyReadonlyArray)

// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------

/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = <A, R, E, B>(
  f: (index: number, a: A) => ReaderEither<R, E, B>
): ((as: ReadonlyNonEmptyArray<A>) => ReaderEither<R, E, ReadonlyNonEmptyArray<B>>) =>
  flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(E.traverseReadonlyNonEmptyArrayWithIndex(SK)))

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndex = <A, R, E, B>(
  f: (index: number, a: A) => ReaderEither<R, E, B>
): ((as: ReadonlyArray<A>) => ReaderEither<R, E, ReadonlyArray<B>>) => {
  const g = traverseReadonlyNonEmptyArrayWithIndex(f)
  return (as) => (_.isNonEmpty(as) ? g(as) : ApT)
}

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArrayWithIndex: <R, E, A, B>(
  f: (index: number, a: A) => ReaderEither<R, E, B>
) => (as: ReadonlyArray<A>) => ReaderEither<R, E, ReadonlyArray<B>> = traverseReadonlyArrayWithIndex

/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArray = <R, E, A, B>(
  f: (a: A) => ReaderEither<R, E, B>
): ((as: ReadonlyArray<A>) => ReaderEither<R, E, ReadonlyArray<B>>) => traverseReadonlyArrayWithIndex((_, a) => f(a))

/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const sequenceArray: <R, E, A>(
  arr: ReadonlyArray<ReaderEither<R, E, A>>
) => ReaderEither<R, E, ReadonlyArray<A>> = /*#__PURE__*/ traverseArray(identity)

// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------

/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chain: <R, E, A, B>(
  f: (a: A) => ReaderEither<R, E, B>
) => (ma: ReaderEither<R, E, A>) => ReaderEither<R, E, B> = flatMap

/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
export const chainW: <R2, E2, A, B>(
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, B> = flatMap

/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chainFirst: <R, E, A, B>(
  f: (a: A) => ReaderEither<R, E, B>
) => (ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A> = tap

/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
export const chainFirstW: <R2, E2, A, B>(
  f: (a: A) => ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, A> = tap

/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const orElseFirst: <E, R, B>(
  onLeft: (e: E) => ReaderEither<R, E, B>
) => <A>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A> = tapError

/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const orElseFirstW: <E1, R2, E2, B>(
  onLeft: (e: E1) => ReaderEither<R2, E2, B>
) => <R1, A>(ma: ReaderEither<R1, E1, A>) => ReaderEither<R1 & R2, E1 | E2, A> = tapError

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RE.Functor` instead of `RE.readerEither`
 * (where `R` is from `import R from 'fp-ts/ReaderEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const readerEither: Monad3<URI> & Bifunctor3<URI> & Alt3<URI> & MonadThrow3<URI> = {
  URI,
  bimap: mapBoth,
  mapLeft: mapError,
  map: _map,
  of,
  ap: _ap,
  chain: flatMap,
  alt: _alt,
  throwError: left
}

/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getApplySemigroup: <R, E, A>(S: Semigroup<A>) => Semigroup<ReaderEither<R, E, A>> =
  /*#__PURE__*/ getApplySemigroup_(Apply)

/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getApplyMonoid: <R, E, A>(M: Monoid<A>) => Monoid<ReaderEither<R, E, A>> =
  /*#__PURE__*/ getApplicativeMonoid(Applicative)

/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getSemigroup = <R, E, A>(S: Semigroup<A>): Semigroup<ReaderEither<R, E, A>> =>
  getApplySemigroup_(R.Apply)(E.getSemigroup(S))

/**
 * Use [`getApplicativeReaderValidation`](#getapplicativereadervalidation) and [`getAltReaderValidation`](#getaltreadervalidation) instead.
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export function getReaderValidation<E>(
  SE: Semigroup<E>
): Monad3C<URI, E> & Bifunctor3<URI> & Alt3C<URI, E> & MonadThrow3C<URI, E> {
  const applicativeReaderValidation = getApplicativeReaderValidation(SE)
  const altReaderValidation = getAltReaderValidation(SE)
  return {
    URI,
    _E: undefined as any,
    map: _map,
    ap: applicativeReaderValidation.ap,
    of,
    chain: flatMap,
    bimap: mapBoth,
    mapLeft: mapError,
    alt: altReaderValidation.alt,
    throwError
  }
}
