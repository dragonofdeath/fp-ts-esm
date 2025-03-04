/**
 * @since 2.0.0
 */
import { Alt4 } from './Alt.js'
import { Applicative4 } from './Applicative.js'
import { apFirst as apFirst_, Apply4, apS as apS_, apSecond as apSecond_ } from './Apply.js'
import { Bifunctor4 } from './Bifunctor.js'
import * as chainable from './Chain.js'
import * as E from './Either.js'
import { Endomorphism } from './Endomorphism.js'
import {
  chainOptionK as chainOptionK_,
  filterOrElse as filterOrElse_,
  FromEither4,
  fromEitherK as fromEitherK_,
  fromOption as fromOption_,
  fromOptionK as fromOptionK_,
  fromPredicate as fromPredicate_,
  tapEither as tapEither_
} from './FromEither.js'
import { FromIO4, fromIOK as fromIOK_, tapIO as tapIO_ } from './FromIO.js'
import {
  ask as ask_,
  asks as asks_,
  FromReader4,
  fromReaderK as fromReaderK_,
  tapReader as tapReader_
} from './FromReader.js'
import {
  chainStateK as chainStateK_,
  FromState4,
  fromStateK as fromStateK_,
  get as get_,
  gets as gets_,
  modify as modify_,
  put as put_
} from './FromState.js'
import { FromTask4, fromTaskK as fromTaskK_, tapTask as tapTask_ } from './FromTask.js'
import { dual, flow, identity, LazyArg, pipe } from './function.js'
import { as as as_, asUnit as asUnit_, bindTo as bindTo_, flap as flap_, Functor4, let as let__ } from './Functor.js'
import * as _ from './internal.js'
import { IO } from './IO.js'
import { IOEither } from './IOEither.js'
import { Monad4 } from './Monad.js'
import { MonadIO4 } from './MonadIO.js'
import { MonadTask4 } from './MonadTask.js'
import { MonadThrow4 } from './MonadThrow.js'
import { NonEmptyArray } from './NonEmptyArray.js'
import { Option } from './Option.js'
import { Pointed4 } from './Pointed.js'
import { Predicate } from './Predicate.js'
import * as R from './Reader.js'
import { ReaderEither } from './ReaderEither.js'
import * as RTE from './ReaderTaskEither.js'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray.js'
import { Refinement } from './Refinement.js'
import { State } from './State.js'
import * as ST from './StateT.js'
import { Task } from './Task.js'
import { TaskEither } from './TaskEither.js'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

import ReaderTaskEither = RTE.ReaderTaskEither
import Either = E.Either
import Reader = R.Reader

/**
 * @category model
 * @since 2.0.0
 */
export interface StateReaderTaskEither<S, R, E, A> {
  (s: S): ReaderTaskEither<R, E, [A, S]>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.0.0
 */
export const left: <S, R, E, A = never>(e: E) => StateReaderTaskEither<S, R, E, A> = (e) => () => RTE.left(e)

/**
 * @category constructors
 * @since 2.0.0
 */
export const right: <S, R, E = never, A = never>(a: A) => StateReaderTaskEither<S, R, E, A> = /*#__PURE__*/ ST.of(
  RTE.Pointed
)

/**
 * @category constructors
 * @since 2.0.0
 */
export function rightTask<S, R, E = never, A = never>(ma: Task<A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.rightTask(ma))
}

/**
 * @category constructors
 * @since 2.0.0
 */
export function leftTask<S, R, E, A = never>(me: Task<E>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.leftTask(me))
}

/**
 * @category constructors
 * @since 2.0.0
 */
export function rightReader<S, R, E = never, A = never>(ma: Reader<R, A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.rightReader(ma))
}

/**
 * @category constructors
 * @since 2.0.0
 */
export function leftReader<S, R, E, A = never>(me: Reader<R, E>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.leftReader(me))
}

/**
 * @category constructors
 * @since 2.0.0
 */
export function rightIO<S, R, E = never, A = never>(ma: IO<A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.rightIO(ma))
}

/**
 * @category constructors
 * @since 2.0.0
 */
export function leftIO<S, R, E, A = never>(me: IO<E>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.leftIO(me))
}

/**
 * @category constructors
 * @since 2.0.0
 */
export const rightState: <S, R, E = never, A = never>(ma: State<S, A>) => StateReaderTaskEither<S, R, E, A> = (sa) =>
  flow(sa, RTE.right)

/**
 * @category constructors
 * @since 2.0.0
 */
export const leftState: <S, R, E, A = never>(me: State<S, E>) => StateReaderTaskEither<S, R, E, A> = (me) => (s) =>
  RTE.left(me(s)[0])

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromEither: <E, A, S, R = unknown>(fa: Either<E, A>) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/ E.match((e) => left(e), right)

/**
 * @category conversions
 * @since 2.11.0
 */
export const fromReader: <R, A, S, E = never>(fa: Reader<R, A>) => StateReaderTaskEither<S, R, E, A> = rightReader

/**
 * @category conversions
 * @since 2.7.0
 */
export const fromIO: <A, S, R = unknown, E = never>(fa: IO<A>) => StateReaderTaskEither<S, R, E, A> = rightIO

/**
 * @category conversions
 * @since 2.7.0
 */
export const fromTask: <A, S, R = unknown, E = never>(fa: Task<A>) => StateReaderTaskEither<S, R, E, A> = rightTask

/**
 * @category conversions
 * @since 2.10.0
 */
export const fromState: <S, A, R = unknown, E = never>(fa: State<S, A>) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/ ST.fromState(RTE.Pointed)

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromTaskEither: <E, A, S, R = unknown>(fa: TaskEither<E, A>) => StateReaderTaskEither<S, R, E, A> = (ma) =>
  fromReaderTaskEither(RTE.fromTaskEither(ma))

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromIOEither: <E, A, S, R = unknown>(fa: IOEither<E, A>) => StateReaderTaskEither<S, R, E, A> = (ma) =>
  fromReaderTaskEither(RTE.fromIOEither(ma))

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromReaderEither: <R, E, A, S>(fa: ReaderEither<R, E, A>) => StateReaderTaskEither<S, R, E, A> = (ma) =>
  fromReaderTaskEither(RTE.fromReaderEither(ma))

/**
 * @category constructors
 * @since 2.0.0
 */
export const fromReaderTaskEither: <R, E, A, S>(fa: ReaderTaskEither<R, E, A>) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/ ST.fromF(RTE.Functor)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.11.0
 */
export const local =
  <R2, R1>(f: (r2: R2) => R1) =>
  <S, E, A>(ma: StateReaderTaskEither<S, R1, E, A>): StateReaderTaskEither<S, R2, E, A> =>
    flow(ma, R.local(f))

/**
 * Less strict version of [`asksStateReaderTaskEither`](#asksstatereadertaskeither).
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksStateReaderTaskEitherW =
  <R1, S, R2, E, A>(f: (r1: R1) => StateReaderTaskEither<S, R2, E, A>): StateReaderTaskEither<S, R1 & R2, E, A> =>
  (s) =>
  (r) =>
    f(r)(s)(r)

/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksStateReaderTaskEither: <R, S, E, A>(
  f: (r: R) => StateReaderTaskEither<S, R, E, A>
) => StateReaderTaskEither<S, R, E, A> = asksStateReaderTaskEitherW

/**
 * @category lifting
 * @since 2.4.0
 */
export const fromIOEitherK =
  <E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => IOEither<E, B>
  ): (<S, R = unknown>(...a: A) => StateReaderTaskEither<S, R, E, B>) =>
  (...a) =>
    fromIOEither(f(...a))

/**
 * @category lifting
 * @since 2.4.0
 */
export const fromTaskEitherK =
  <E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => TaskEither<E, B>
  ): (<S, R = unknown>(...a: A) => StateReaderTaskEither<S, R, E, B>) =>
  (...a) =>
    fromTaskEither(f(...a))

/**
 * @category lifting
 * @since 2.4.0
 */
export const fromReaderTaskEitherK =
  <R, E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => ReaderTaskEither<R, E, B>
  ): (<S>(...a: A) => StateReaderTaskEither<S, R, E, B>) =>
  (...a) =>
    fromReaderTaskEither(f(...a))

/**
 * Alias of `flatMapReaderTaskEither`.
 *
 * Less strict version of [`chainReaderTaskEitherK`](#chainreadertaskeitherk).
 *
 * @category legacy
 * @since 2.6.1
 */
export const chainReaderTaskEitherKW =
  <R, E2, A, B>(f: (a: A) => ReaderTaskEither<R, E2, B>) =>
  <S, E1>(ma: StateReaderTaskEither<S, R, E1, A>): StateReaderTaskEither<S, R, E1 | E2, B> =>
    flatMap<S, R, E1, A, R, E1 | E2, B>(ma, fromReaderTaskEitherK(f))

/**
 * Alias of `flatMapReaderTaskEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export const chainReaderTaskEitherK: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => <S>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = chainReaderTaskEitherKW

/* istanbul ignore next */
const _map: Monad4<URI>['map'] = (fa, f) => pipe(fa, map(f))
/* istanbul ignore next */
const _ap: Monad4<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const _alt: <S, R, E, A>(
  fa: StateReaderTaskEither<S, R, E, A>,
  that: LazyArg<StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, A> = (fa, that) => (s) =>
  pipe(
    fa(s),
    RTE.alt(() => that()(s))
  )
const _bimap: <S, R, E, A, G, B>(
  fea: StateReaderTaskEither<S, R, E, A>,
  f: (e: E) => G,
  g: (a: A) => B
) => StateReaderTaskEither<S, R, G, B> = (fea, f, g) => (s) =>
  pipe(
    fea(s),
    RTE.bimap(f, ([a, s]) => [g(a), s])
  )
const _mapLeft: <S, R, E, A, G>(
  fea: StateReaderTaskEither<S, R, E, A>,
  f: (e: E) => G
) => StateReaderTaskEither<S, R, G, A> = (fea, f) => (s) => pipe(fea(s), RTE.mapLeft(f))

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map: <A, B>(
  f: (a: A) => B
) => <S, R, E>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ ST.map(
  RTE.Functor
)

/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.6.2
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <S, R>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, G, B> = (f, g) => (fa) =>
  _bimap(fa, f, g)

/**
 * Map a function over the third type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.6.2
 */
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <S, R, A>(fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, G, A> = (f) => (fa) =>
  _mapLeft(fa, f)

/**
 * @since 2.0.0
 */
export const ap: <S, R, E, A>(
  fa: StateReaderTaskEither<S, R, E, A>
) => <B>(fab: StateReaderTaskEither<S, R, E, (a: A) => B>) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ ST.ap(
  RTE.Chain
)

/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
export const apW: <S, R2, E2, A>(
  fa: StateReaderTaskEither<S, R2, E2, A>
) => <R1, E1, B>(fab: StateReaderTaskEither<S, R1, E1, (a: A) => B>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B> =
  ap as any

/**
 * @category constructors
 * @since 2.7.0
 */
export const of: <S, R = unknown, E = never, A = never>(a: A) => StateReaderTaskEither<S, R, E, A> = right

/** @internal */
interface StateReaderTaskEitherTypeLambda extends _.TypeLambda {
  readonly type: StateReaderTaskEither<this['Out2'], this['In'], this['Out1'], this['Target']>
}

/** @internal */
const _FromIO: _.FromIO<StateReaderTaskEitherTypeLambda> = {
  fromIO
}

/** @internal */
const _FromTask: _.FromTask<StateReaderTaskEitherTypeLambda> = {
  fromTask
}

/** @internal */
const _FromReader: _.FromReader<StateReaderTaskEitherTypeLambda> = {
  fromReader
}

/** @internal */
const _FromEither: _.FromEither<StateReaderTaskEitherTypeLambda> = {
  fromEither
}

/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap: {
  <A, S, R2, E2, B>(f: (a: A) => StateReaderTaskEither<S, R2, E2, B>): <R1, E1>(
    ma: StateReaderTaskEither<S, R1, E1, A>
  ) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
  <S, R1, E1, A, R2, E2, B>(
    ma: StateReaderTaskEither<S, R1, E1, A>,
    f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
  ): StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
} = /*#__PURE__*/ dual(2, ST.flatMap(RTE.Monad))

/** @internal */
const _FlatMap: _.FlatMap<StateReaderTaskEitherTypeLambda> = {
  flatMap
}

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapTaskEither: {
  <A, E2, B>(f: (a: A) => TaskEither<E2, B>): <S, R, E1>(
    self: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <S, R, E1, A, E2, B>(self: StateReaderTaskEither<S, R, E1, A>, f: (a: A) => TaskEither<E2, B>): StateReaderTaskEither<
    S,
    R,
    E1 | E2,
    B
  >
} = /*#__PURE__*/ dual(
  2,
  <S, R, E1, A, E2, B>(
    self: StateReaderTaskEither<S, R, E1, A>,
    f: (a: A) => TaskEither<E2, B>
  ): StateReaderTaskEither<S, R, E1 | E2, B> => flatMap(self, (a: A) => fromTaskEitherK(f)<S, R>(a))
)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapIO: {
  <A, B>(f: (a: A) => IO<B>): <S, R, E>(self: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
  <S, R, E, A, B>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => IO<B>): StateReaderTaskEither<S, R, E, B>
} = /*#__PURE__*/ _.flatMapIO(_FromIO, _FlatMap)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapTask: {
  <A, B>(f: (a: A) => Task<B>): <S, R, E>(self: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B>
  <S, R, E, A, B>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => Task<B>): StateReaderTaskEither<S, R, E, B>
} = /*#__PURE__*/ _.flatMapTask(_FromTask, _FlatMap)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapReader: {
  <A, R2, B>(f: (a: A) => Reader<R2, B>): <S, R1, E>(
    self: StateReaderTaskEither<S, R1, E, A>
  ) => StateReaderTaskEither<S, R1 & R2, E, B>
  <S, R1, E, A, R2, B>(self: StateReaderTaskEither<S, R1, E, A>, f: (a: A) => Reader<R2, B>): StateReaderTaskEither<
    S,
    R1 & R2,
    E,
    B
  >
} = /*#__PURE__*/ _.flatMapReader(_FromReader, _FlatMap)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapIOEither: {
  <A, E2, B>(f: (a: A) => IOEither<E2, B>): <S, R, E1>(
    self: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <S, R, E1, A, E2, B>(self: StateReaderTaskEither<S, R, E1, A>, f: (a: A) => IOEither<E2, B>): StateReaderTaskEither<
    S,
    R,
    E1 | E2,
    B
  >
} = /*#__PURE__*/ dual(
  2,
  <S, R, E1, A, E2, B>(
    self: StateReaderTaskEither<S, R, E1, A>,
    f: (a: A) => IOEither<E2, B>
  ): StateReaderTaskEither<S, R, E1 | E2, B> => flatMap(self, (a: A) => fromIOEitherK(f)<S, R>(a))
)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapEither: {
  <A, E2, B>(f: (a: A) => Either<E2, B>): <S, R, E1>(
    self: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <S, R, E1, A, E2, B>(self: StateReaderTaskEither<S, R, E1, A>, f: (a: A) => Either<E2, B>): StateReaderTaskEither<
    S,
    R,
    E1 | E2,
    B
  >
} = /*#__PURE__*/ dual(2, _.flatMapEither(_FromEither, _FlatMap))

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapOption: {
  <A, E2, B>(f: (a: A) => Option<B>, onNone: (a: A) => E2): <S, R, E1>(
    self: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <S, R, E1, A, E2, B>(
    self: StateReaderTaskEither<S, R, E1, A>,
    f: (a: A) => Option<B>,
    onNone: (a: A) => E2
  ): StateReaderTaskEither<S, R, E1 | E2, B>
} = /*#__PURE__*/ _.flatMapOption(_FromEither, _FlatMap)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapReaderTaskEither: {
  <A, R2, E2, B>(f: (a: A) => ReaderTaskEither<R2, E2, B>): <S, R1, E1>(
    self: StateReaderTaskEither<S, R1, E1, A>
  ) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
  <S, R1, E1, A, R2, E2, B>(
    self: StateReaderTaskEither<S, R1, E1, A>,
    f: (a: A) => ReaderTaskEither<R2, E2, B>
  ): StateReaderTaskEither<S, R1 & R2, E1 | E2, B>
} = /*#__PURE__*/ dual(
  2,
  <S, R1, E1, A, R2, E2, B>(
    self: StateReaderTaskEither<S, R1, E1, A>,
    f: (a: A) => ReaderTaskEither<R2, E2, B>
  ): StateReaderTaskEither<S, R1 & R2, E1 | E2, B> => flatMap(self, (a: A) => fromReaderTaskEitherK(f)<S>(a))
)

/**
 * @category sequencing
 * @since 2.16.0
 */
export const flatMapState: {
  <S, A, B>(f: (a: A) => State<S, B>): <R, E>(
    self: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, B>
  <S, R, E, A, B>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => State<S, B>): StateReaderTaskEither<S, R, E, B>
} = /*#__PURE__*/ dual(
  2,
  <S, R, E, A, B>(
    self: StateReaderTaskEither<S, R, E, A>,
    f: (a: A) => State<S, B>
  ): StateReaderTaskEither<S, R, E, B> => flatMap(self, fromStateK(f))
)

/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const flattenW: <S, R1, E1, R2, E2, A>(
  mma: StateReaderTaskEither<S, R1, E1, StateReaderTaskEither<S, R2, E2, A>>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A> = /*#__PURE__*/ flatMap(identity)

/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten: <S, R, E, A>(
  mma: StateReaderTaskEither<S, R, E, StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, A> = flattenW

/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the environment, the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW =
  <S, R2, E2, B>(that: () => StateReaderTaskEither<S, R2, E2, B>) =>
  <R1, E1, A>(fa: StateReaderTaskEither<S, R1, E1, A>): StateReaderTaskEither<S, R1 & R2, E2, A | B> =>
  (r) =>
    pipe(
      fa(r),
      RTE.altW(() => that()(r))
    )

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.6.2
 */
export const alt: <S, R, E, A>(
  that: LazyArg<StateReaderTaskEither<S, R, E, A>>
) => (fa: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A> = altW

/**
 * @since 2.7.0
 */
export const throwError: MonadThrow4<URI>['throwError'] = left

/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'StateReaderTaskEither'

/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI

declare module './HKT' {
  interface URItoKind4<S, R, E, A> {
    readonly [URI]: StateReaderTaskEither<S, R, E, A>
  }
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Functor: Functor4<URI> = {
  URI,
  map: _map
}

/**
 * Maps the `Right` value of this `StateReaderTaskEither` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export const as: {
  <A>(a: A): <S, R, E, _>(self: StateReaderTaskEither<S, R, E, _>) => StateReaderTaskEither<S, R, E, A>
  <S, R, E, _, A>(self: StateReaderTaskEither<S, R, E, _>, a: A): StateReaderTaskEither<S, R, E, A>
} = dual(2, as_(Functor))

/**
 * Maps the `Right` value of this `StateReaderTaskEither` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export const asUnit: <S, R, E, _>(self: StateReaderTaskEither<S, R, E, _>) => StateReaderTaskEither<S, R, E, void> =
  asUnit_(Functor)

/**
 * @category mapping
 * @since 2.10.0
 */
export const flap = /*#__PURE__*/ flap_(Functor)

/**
 * @category instances
 * @since 2.10.0
 */
export const Pointed: Pointed4<URI> = {
  URI,
  of
}

/**
 * @category instances
 * @since 2.10.0
 */
export const Apply: Apply4<URI> = {
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
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
export const apFirstW: <S, R2, E2, A, B>(
  second: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(first: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A> =
  apFirst as any

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export const apSecond = /*#__PURE__*/ apSecond_(Apply)

/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
export const apSecondW: <S, R2, E2, A, B>(
  second: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(first: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B> =
  apSecond as any

/**
 * @category instances
 * @since 2.7.0
 */
export const Applicative: Applicative4<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of
}

/**
 * @category instances
 * @since 2.10.0
 */
export const Chain: chainable.Chain4<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: flatMap
}

/**
 * @category instances
 * @since 2.11.0
 */
export const FromState: FromState4<URI> = {
  URI,
  fromState
}

/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export const get: <S, R, E = never>() => StateReaderTaskEither<S, R, E, S> = /*#__PURE__*/ get_(FromState)

/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
export const put: <S, R, E = never>(s: S) => StateReaderTaskEither<S, R, E, void> = /*#__PURE__*/ put_(FromState)

/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export const modify: <S, R, E = never>(f: Endomorphism<S>) => StateReaderTaskEither<S, R, E, void> =
  /*#__PURE__*/ modify_(FromState)

/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export const gets: <S, R, E = never, A = never>(f: (s: S) => A) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/ gets_(FromState)

/**
 * @category lifting
 * @since 2.11.0
 */
export const fromStateK: <A extends ReadonlyArray<unknown>, S, B>(
  f: (...a: A) => State<S, B>
) => <R = unknown, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ fromStateK_(FromState)

/**
 * Alias of `flatMapState`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainStateK: <A, S, B>(
  f: (a: A) => State<S, B>
) => <R, E>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ chainStateK_(
  FromState,
  Chain
)

/**
 * @category instances
 * @since 2.10.0
 */
export const Monad: Monad4<URI> = {
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
export const MonadIO: MonadIO4<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: flatMap,
  fromIO
}

/**
 * @category instances
 * @since 2.10.0
 */
export const MonadTask: MonadTask4<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: flatMap,
  fromIO,
  fromTask
}

/**
 * @category instances
 * @since 2.10.0
 */
export const MonadThrow: MonadThrow4<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: flatMap,
  throwError
}

/**
 * @category instances
 * @since 2.10.0
 */
export const FromEither: FromEither4<URI> = {
  URI,
  fromEither
}

/**
 * @category instances
 * @since 2.10.0
 */
export const FromIO: FromIO4<URI> = {
  URI,
  fromIO
}

/**
 * @category instances
 * @since 2.10.0
 */
export const FromTask: FromTask4<URI> = {
  URI,
  fromIO,
  fromTask
}

/**
 * @category instances
 * @since 2.11.0
 */
export const FromReader: FromReader4<URI> = {
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
  <S, R1, E1, A, R2, E2, _>(
    self: StateReaderTaskEither<S, R1, E1, A>,
    f: (a: A) => StateReaderTaskEither<S, R2, E2, _>
  ): StateReaderTaskEither<S, R1 & R2, E1 | E2, A>
  <A, S, R2, E2, _>(f: (a: A) => StateReaderTaskEither<S, R2, E2, _>): <R1, E1>(
    self: StateReaderTaskEither<S, R1, E1, A>
  ) => StateReaderTaskEither<S, R1 & R2, E2 | E1, A>
} = /*#__PURE__*/ dual(2, chainable.tap(Chain))

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export const tapEither: {
  <A, E2, _>(f: (a: A) => Either<E2, _>): <S, R1, E1>(
    self: StateReaderTaskEither<S, R1, E1, A>
  ) => StateReaderTaskEither<S, R1, E2 | E1, A>
  <S, R1, E1, A, E2, _>(self: StateReaderTaskEither<S, R1, E1, A>, f: (a: A) => Either<E2, _>): StateReaderTaskEither<
    S,
    R1,
    E1 | E2,
    A
  >
} = /*#__PURE__*/ dual(2, tapEither_(FromEither, Chain))

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export const tapIO: {
  <A, _>(f: (a: A) => IO<_>): <S, R, E>(self: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
  <S, R, E, A, _>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => IO<_>): StateReaderTaskEither<S, R, E, A>
} = /*#__PURE__*/ dual(2, tapIO_(FromIO, Chain))

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export const tapTask: {
  <A, _>(f: (a: A) => Task<_>): <S, R, E>(self: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A>
  <S, R, E, A, _>(self: StateReaderTaskEither<S, R, E, A>, f: (a: A) => Task<_>): StateReaderTaskEither<S, R, E, A>
} = /*#__PURE__*/ dual(2, tapTask_(FromTask, Chain))

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.16.0
 */
export const tapReader: {
  <A, R2, _>(f: (a: A) => Reader<R2, _>): <S, R1, E>(
    self: StateReaderTaskEither<S, R1, E, A>
  ) => StateReaderTaskEither<S, R1 & R2, E, A>
  <S, R1, E, A, R2, _>(self: StateReaderTaskEither<S, R1, E, A>, f: (a: A) => Reader<R2, _>): StateReaderTaskEither<
    S,
    R1 & R2,
    E,
    A
  >
} = /*#__PURE__*/ dual(2, tapReader_(FromReader, Chain))

/**
 * @category instances
 * @since 2.7.0
 */
export const Bifunctor: Bifunctor4<URI> = {
  URI,
  bimap: _bimap,
  mapLeft: _mapLeft
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Alt: Alt4<URI> = {
  URI,
  map: _map,
  alt: _alt
}

/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.11.0
 */
export const ask: <S, R, E = never>() => StateReaderTaskEither<S, R, E, R> = /*#__PURE__*/ ask_(FromReader)

/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asks: <S, R, A, E = never>(f: (r: R) => A) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/ asks_(FromReader)

/**
 * @category lifting
 * @since 2.11.0
 */
export const fromReaderK: <A extends ReadonlyArray<unknown>, R, B>(
  f: (...a: A) => Reader<R, B>
) => <S, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ fromReaderK_(FromReader)

/**
 * Alias of `flatMapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <S, E>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = flatMapReader

/**
 * Alias of `flatMapReader`.
 *
 * Less strict version of [`chainReaderK`](#chainReaderK).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainReaderKW: <A, R1, B>(
  f: (a: A) => Reader<R1, B>
) => <S, R2, E>(ma: StateReaderTaskEither<S, R2, E, A>) => StateReaderTaskEither<S, R1 & R2, E, B> = flatMapReader

/**
 * Alias of `tapReader`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainFirstReaderK: <A, R, B>(
  f: (a: A) => Reader<R, B>
) => <S, E>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A> = tapReader

/**
 * Alias of `tapReader`.
 *
 * Less strict version of [`chainFirstReaderK`](#chainFirstReaderK).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainFirstReaderKW: <A, R1, B>(
  f: (a: A) => Reader<R1, B>
) => <S, R2, E>(ma: StateReaderTaskEither<S, R2, E, A>) => StateReaderTaskEither<S, R1 & R2, E, A> = tapReader

/**
 * @category conversions
 * @since 2.0.0
 */
export const fromOption: <E>(
  onNone: LazyArg<E>
) => <A, S, R = unknown>(fa: Option<A>) => StateReaderTaskEither<S, R, E, A> = /*#__PURE__*/ fromOption_(FromEither)

/**
 * @category lifting
 * @since 2.10.0
 */
export const fromOptionK: <E>(
  onNone: LazyArg<E>
) => <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => <S, R = unknown>(...a: A) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ fromOptionK_(FromEither)

/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainOptionK: <E>(
  onNone: LazyArg<E>
) => <A, B>(
  f: (a: A) => Option<B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ chainOptionK_(
  FromEither,
  Chain
)

/**
 * Use `flatMapOption`.
 *
 * Less strict version of [`chainOptionK`](#chainoptionk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.13.2
 */
export const chainOptionKW: <E2>(
  onNone: LazyArg<E2>
) => <A, B>(
  f: (a: A) => Option<B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B> = chainOptionK as any

/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = flatMapEither

/**
 * Alias of `flatMapEither`.
 *
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.6.1
 */
export const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B> = flatMapEither

/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainFirstEitherK: <A, E, B>(
  f: (a: A) => E.Either<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A> = tapEither

/**
 * Alias of `tapEither`.
 *
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainFirstEitherKW: <A, E2, B>(
  f: (a: A) => Either<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, A> = tapEither

/**
 * @category lifting
 * @since 2.4.4
 */
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R = unknown>(
    a: A
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R = unknown, B extends A = A>(
    b: B
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R = unknown>(a: A) => StateReaderTaskEither<S, R, E, A>
} = /*#__PURE__*/ fromPredicate_(FromEither)

/**
 * @category filtering
 * @since 2.4.4
 */
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R, B extends A>(
    mb: StateReaderTaskEither<S, R, E, B>
  ) => StateReaderTaskEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderTaskEither<S, R, E, A>
  ) => StateReaderTaskEither<S, R, E, A>
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
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <S, R, E1, B extends A>(
    mb: StateReaderTaskEither<S, R, E1, B>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, A>
} = filterOrElse

/**
 * @category lifting
 * @since 2.4.0
 */
export const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => <S, R = unknown>(...a: A) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ fromEitherK_(FromEither)

/**
 * @category lifting
 * @since 2.10.0
 */
export const fromIOK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>
) => <S, R = unknown, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ fromIOK_(FromIO)

/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainIOK: <A, B>(
  f: (a: A) => IO<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = flatMapIO

/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainFirstIOK: <A, B>(
  f: (a: A) => IO<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A> = tapIO

/**
 * Alias of `flatMapTaskEither`.
 *
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * @category legacy
 * @since 2.6.1
 */
export const chainTaskEitherKW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B> = flatMapTaskEither

/**
 * Alias of `flatMapTaskEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = flatMapTaskEither

/**
 * Alias of `flatMapIOEither`.
 *
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category legacy
 * @since 2.6.1
 */
export const chainIOEitherKW: <E2, A, B>(
  f: (a: A) => IOEither<E2, B>
) => <S, R, E1>(ma: StateReaderTaskEither<S, R, E1, A>) => StateReaderTaskEither<S, R, E1 | E2, B> = flatMapIOEither

/**
 * Alias of `flatMapIOEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export const chainIOEitherK: <E, A, B>(
  f: (a: A) => IOEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = flatMapIOEither

/**
 * @category lifting
 * @since 2.10.0
 */
export const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Task<B>
) => <S, R = unknown, E = never>(...a: A) => StateReaderTaskEither<S, R, E, B> = /*#__PURE__*/ fromTaskK_(FromTask)

/**
 * Alias of `flatMapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainTaskK: <A, B>(
  f: (a: A) => Task<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = flatMapTask

/**
 * Alias of `tapTask`.
 * @category legacy
 * @since 2.10.0
 */
export const chainFirstTaskK: <A, B>(
  f: (a: A) => Task<B>
) => <S, R, E>(first: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A> = tapTask

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.8.0
 */
export const evaluate: <S>(s: S) => <R, E, A>(ma: StateReaderTaskEither<S, R, E, A>) => ReaderTaskEither<R, E, A> =
  /*#__PURE__*/ ST.evaluate(RTE.Functor)

/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.8.0
 */
export const execute: <S>(s: S) => <R, E, A>(ma: StateReaderTaskEither<S, R, E, A>) => ReaderTaskEither<R, E, S> =
  /*#__PURE__*/ ST.execute(RTE.Functor)

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 2.8.0
 */
export const bindTo = /*#__PURE__*/ bindTo_(Functor)

const let_ = /*#__PURE__*/ let__(Functor)

export {
  /**
   * @since 2.13.0
   */
  let_ as let
}

/**
 * @since 2.8.0
 */
export const bind = /*#__PURE__*/ chainable.bind(Chain)

/**
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
export const bindW: <N extends string, A, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> =
  bind as any

// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------

/**
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
export const apSW: <A, N extends string, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  fb: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> =
  apS as any

// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------

/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex =
  <A, S, R, E, B>(f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>) =>
  (as: ReadonlyNonEmptyArray<A>): StateReaderTaskEither<S, R, E, ReadonlyNonEmptyArray<B>> =>
  (s) =>
  (r) =>
  () =>
    _.tail(as).reduce<Promise<Either<E, [NonEmptyArray<B>, S]>>>(
      (acc, a, i) =>
        acc.then((ebs) =>
          _.isLeft(ebs)
            ? acc
            : f(
                i + 1,
                a
              )(ebs.right[1])(r)().then((eb) => {
                if (_.isLeft(eb)) {
                  return eb
                }
                const [b, s] = eb.right
                ebs.right[0].push(b)
                ebs.right[1] = s
                return ebs
              })
        ),
      f(0, _.head(as))(s)(r)().then(E.map(([b, s]) => [[b], s]))
    )

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndex = <A, S, R, E, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
): ((as: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>>) => {
  const g = traverseReadonlyNonEmptyArrayWithIndex(f)
  return (as) => (_.isNonEmpty(as) ? g(as) : of(_.emptyReadonlyArray))
}

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArrayWithIndex: <S, R, E, A, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>> = traverseReadonlyArrayWithIndex

/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArray = <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
): ((as: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>>) =>
  traverseReadonlyArrayWithIndex((_, a) => f(a))

/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const sequenceArray: <S, R, E, A>(
  arr: ReadonlyArray<StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, ReadonlyArray<A>> = /*#__PURE__*/ traverseArray(identity)

// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------

/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chain: <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = flatMap

/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
export const chainW: <S, R2, E2, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(ma: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B> = flatMap

/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chainFirst: <S, R, E, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, A> = tap

/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
export const chainFirstW: <S, R2, E2, A, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(ma: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A> = tap

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `SRTE.Functor` instead of `SRTE.stateReaderTaskEither`
 * (where `SRTE` is from `import SRTE from 'fp-ts/StateReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const stateReaderTaskEither: Monad4<URI> & Bifunctor4<URI> & Alt4<URI> & MonadTask4<URI> & MonadThrow4<URI> = {
  URI,
  map: _map,
  of,
  ap: _ap,
  chain: flatMap,
  bimap: _bimap,
  mapLeft: _mapLeft,
  alt: _alt,
  fromIO,
  fromTask,
  throwError
}

/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `SRTE.Functor` instead of `SRTE.stateReaderTaskEitherSeq`
 * (where `SRTE` is from `import SRTE from 'fp-ts/StateReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */

export const stateReaderTaskEitherSeq: typeof stateReaderTaskEither = {
  URI,
  map: _map,
  of,
  ap: _ap,
  chain: flatMap,
  bimap: _bimap,
  mapLeft: _mapLeft,
  alt: _alt,
  fromIO,
  fromTask,
  throwError
}

/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export const evalState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, A> = (
  fsa,
  s
) =>
  pipe(
    fsa(s),
    RTE.map(([a]) => a)
  )

/**
 * Use [`execute`](#execute) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export const execState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, S> = (
  fsa,
  s
) =>
  pipe(
    fsa(s),
    RTE.map(([_, s]) => s)
  )

/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export function run<S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S, r: R): Promise<Either<E, [A, S]>> {
  return ma(s)(r)()
}
