/**
 * ```ts
 * interface IO<A> {
 *   (): A
 * }
 * ```
 *
 * `IO<A>` represents a non-deterministic synchronous computation that can cause side effects, yields a value of
 * type `A` and **never fails**.
 *
 * If you want to represent a synchronous computation that may fail, please see `IOEither`.
 * If you want to represent a synchronous computation that may yield nothing, please see `IOOption`.
 *
 * @since 2.0.0
 */
import { Applicative1, getApplicativeMonoid } from './Applicative.js'
import { apFirst as apFirst_, Apply1, apS as apS_, apSecond as apSecond_, getApplySemigroup } from './Apply.js'
import * as chainable from './Chain.js'
import { ChainRec1 } from './ChainRec.js'
import { FromIO1 } from './FromIO.js'
import { constant, dual, identity } from './function.js'
import { as as as_, asUnit as asUnit_, bindTo as bindTo_, flap as flap_, Functor1, let as let__ } from './Functor.js'
import * as _ from './internal.js'
import { Monad1 } from './Monad.js'
import { MonadIO1 } from './MonadIO.js'
import { Monoid } from './Monoid.js'
import { NonEmptyArray } from './NonEmptyArray.js'
import { Pointed1 } from './Pointed.js'
import { ReadonlyNonEmptyArray } from './ReadonlyNonEmptyArray.js'
import { Semigroup } from './Semigroup.js'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 2.0.0
 */
export interface IO<A> {
  (): A
}

const _map: Monad1<URI>['map'] = (ma, f) => () => f(ma())
const _ap: Monad1<URI>['ap'] = (mab, ma) => () => mab()(ma())
const _chainRec: ChainRec1<URI>['chainRec'] = (a, f) => () => {
  let e = f(a)()
  while (e._tag === 'Left') {
    e = f(e.left)()
  }
  return e.right
}

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map: <A, B>(f: (a: A) => B) => (fa: IO<A>) => IO<B> = (f) => (fa) => _map(fa, f)

/**
 * @since 2.0.0
 */
export const ap: <A>(fa: IO<A>) => <B>(fab: IO<(a: A) => B>) => IO<B> = (fa) => (fab) => _ap(fab, fa)

/**
 * @category constructors
 * @since 2.0.0
 */
export const of: <A>(a: A) => IO<A> = constant

/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap: {
  <A, B>(f: (a: A) => IO<B>): (ma: IO<A>) => IO<B>
  <A, B>(ma: IO<A>, f: (a: A) => IO<B>): IO<B>
} = /*#__PURE__*/ dual(
  2,
  <A, B>(ma: IO<A>, f: (a: A) => IO<B>): IO<B> =>
    () =>
      f(ma())()
)

/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten: <A>(mma: IO<IO<A>>) => IO<A> = /*#__PURE__*/ flatMap(identity)

/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'IO'

/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI

declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: IO<A>
  }
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Functor: Functor1<URI> = {
  URI,
  map: _map
}

/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export const as: {
  <A>(a: A): <_>(self: IO<_>) => IO<A>
  <_, A>(self: IO<_>, a: A): IO<A>
} = dual(2, as_(Functor))

/**
 * Maps the value to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
export const asUnit: <_>(self: IO<_>) => IO<void> = asUnit_(Functor)

/**
 * @category mapping
 * @since 2.10.0
 */
export const flap = /*#__PURE__*/ flap_(Functor)

/**
 * @category instances
 * @since 2.10.0
 */
export const Pointed: Pointed1<URI> = {
  URI,
  of
}

/**
 * @category instances
 * @since 2.10.0
 */
export const Apply: Apply1<URI> = {
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
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export const apSecond = /*#__PURE__*/ apSecond_(Apply)

/**
 * @category instances
 * @since 2.7.0
 */
export const Applicative: Applicative1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of
}

/**
 * @category instances
 * @since 2.10.0
 */
export const Chain: chainable.Chain1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: flatMap
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Monad: Monad1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: flatMap
}

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export const tap: {
  <A, _>(self: IO<A>, f: (a: A) => IO<_>): IO<A>
  <A, _>(f: (a: A) => IO<_>): (self: IO<A>) => IO<A>
} = /*#__PURE__*/ dual(2, chainable.tap(Chain))

/**
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const fromIO: <A>(fa: IO<A>) => IO<A> = identity

/**
 * @category instances
 * @since 2.7.0
 */
export const MonadIO: MonadIO1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: flatMap,
  fromIO
}

/**
 * @category instances
 * @since 2.7.0
 */
export const ChainRec: ChainRec1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: flatMap,
  chainRec: _chainRec
}

/**
 * @category instances
 * @since 2.10.0
 */
export const FromIO: FromIO1<URI> = {
  URI,
  fromIO: identity
}

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @category do notation
 * @since 2.9.0
 */
export const Do: IO<{}> = /*#__PURE__*/ of(_.emptyRecord)

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
 * @category do notation
 * @since 2.8.0
 */
export const apS = /*#__PURE__*/ apS_(Apply)

/**
 * @since 2.11.0
 */
export const ApT: IO<readonly []> = /*#__PURE__*/ of(_.emptyReadonlyArray)

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
  <A, B>(f: (index: number, a: A) => IO<B>) =>
  (as: ReadonlyNonEmptyArray<A>): IO<ReadonlyNonEmptyArray<B>> =>
  () => {
    const out: NonEmptyArray<B> = [f(0, _.head(as))()]
    for (let i = 1; i < as.length; i++) {
      out.push(f(i, as[i])())
    }
    return out
  }

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndex = <A, B>(
  f: (index: number, a: A) => IO<B>
): ((as: ReadonlyArray<A>) => IO<ReadonlyArray<B>>) => {
  const g = traverseReadonlyNonEmptyArrayWithIndex(f)
  return (as) => (_.isNonEmpty(as) ? g(as) : ApT)
}

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArrayWithIndex: <A, B>(
  f: (index: number, a: A) => IO<B>
) => (as: ReadonlyArray<A>) => IO<ReadonlyArray<B>> = traverseReadonlyArrayWithIndex

/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArray = <A, B>(f: (a: A) => IO<B>): ((as: ReadonlyArray<A>) => IO<ReadonlyArray<B>>) =>
  traverseReadonlyArrayWithIndex((_, a) => f(a))

/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const sequenceArray: <A>(arr: ReadonlyArray<IO<A>>) => IO<ReadonlyArray<A>> =
  /*#__PURE__*/ traverseArray(identity)

// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------

/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chain: <A, B>(f: (a: A) => IO<B>) => (ma: IO<A>) => IO<B> = flatMap

/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chainFirst: <A, B>(f: (a: A) => IO<B>) => (first: IO<A>) => IO<A> = tap

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `IO.Functor` instead of `IO.io`
 * (where `IO` is from `import IO from 'fp-ts/IO'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const io: Monad1<URI> & MonadIO1<URI> & ChainRec1<URI> = {
  URI,
  map: _map,
  of,
  ap: _ap,
  chain: flatMap,
  fromIO,
  chainRec: _chainRec
}

/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getSemigroup: <A>(S: Semigroup<A>) => Semigroup<IO<A>> = /*#__PURE__*/ getApplySemigroup(Apply)

/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getMonoid: <A>(M: Monoid<A>) => Monoid<IO<A>> = /*#__PURE__*/ getApplicativeMonoid(Applicative)
