/**
 * @since 2.0.0
 */
import { Alt1 } from './Alt.js'
import { Applicative as ApplicativeHKT, Applicative1 } from './Applicative.js'
import { apFirst as apFirst_, Apply1, apS as apS_, apSecond as apSecond_ } from './Apply.js'
import { bind as bind_, Chain1, tap as tap_ } from './Chain.js'
import { ChainRec1, tailRec } from './ChainRec.js'
import { Comonad1 } from './Comonad.js'
import { Eq } from './Eq.js'
import { Extend1 } from './Extend.js'
import { Foldable1 } from './Foldable.js'
import { dual, identity as id, pipe } from './function.js'
import { bindTo as bindTo_, flap as flap_, Functor1, let as let__ } from './Functor.js'
import { HKT } from './HKT.js'
import * as _ from './internal.js'
import { Monad1 } from './Monad.js'
import { Monoid } from './Monoid.js'
import { Pointed1 } from './Pointed.js'
import { Show } from './Show.js'
import { PipeableTraverse1, Traversable1 } from './Traversable.js'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 2.0.0
 */
export type Identity<A> = A

const _map: Monad1<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _ap: Monad1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const _reduce: Foldable1<URI>['reduce'] = (fa, b, f) => pipe(fa, reduce(b, f))
/* istanbul ignore next */
const _foldMap: Foldable1<URI>['foldMap'] = (M) => (fa, f) => pipe(fa, foldMap(M)(f))
/* istanbul ignore next */
const _reduceRight: Foldable1<URI>['reduceRight'] = (fa, b, f) => pipe(fa, reduceRight(b, f))
/* istanbul ignore next */
const _alt: Alt1<URI>['alt'] = (fa, that) => pipe(fa, alt(that))
/* istanbul ignore next */
const _extend: Extend1<URI>['extend'] = (wa, f) => pipe(wa, extend(f))
/* istanbul ignore next */
const _traverse = <F>(
  F: ApplicativeHKT<F>
): (<A, B>(ta: Identity<A>, f: (a: A) => HKT<F, B>) => HKT<F, Identity<B>>) => {
  const traverseF = traverse(F)
  return (ta, f) => pipe(ta, traverseF(f))
}
const _chainRec: ChainRec1<URI>['chainRec'] = tailRec

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map: <A, B>(f: (a: A) => B) => (fa: Identity<A>) => Identity<B> = (f) => (fa) => f(fa)

/**
 * @since 2.0.0
 */
export const ap: <A>(fa: Identity<A>) => <B>(fab: Identity<(a: A) => B>) => Identity<B> = (fa) => (fab) => fab(fa)

/**
 * @category constructors
 * @since 2.0.0
 */
export const of: <A>(a: A) => Identity<A> = id

/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap: {
  <A, B>(f: (a: A) => Identity<B>): (ma: Identity<A>) => Identity<B>
  <A, B>(ma: Identity<A>, f: (a: A) => Identity<B>): Identity<B>
} = /*#__PURE__*/ dual(2, <A, B>(ma: Identity<A>, f: (a: A) => Identity<B>): Identity<B> => f(ma))

/**
 * @since 2.0.0
 */
export const extend: <A, B>(f: (wa: Identity<A>) => B) => (wa: Identity<A>) => Identity<B> = (f) => (wa) => f(wa)

/**
 * @category Extract
 * @since 2.6.2
 */
export const extract: <A>(wa: Identity<A>) => A = id

/**
 * @since 2.0.0
 */
export const duplicate: <A>(ma: Identity<A>) => Identity<Identity<A>> = /*#__PURE__*/ extend(id)

/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten: <A>(mma: Identity<Identity<A>>) => Identity<A> = /*#__PURE__*/ flatMap(id)

/**
 * @category folding
 * @since 2.0.0
 */
export const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Identity<A>) => B = (b, f) => (fa) => f(b, fa)

/**
 * @category folding
 * @since 2.0.0
 */
export const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Identity<A>) => M = () => (f) => (fa) => f(fa)

/**
 * @category folding
 * @since 2.0.0
 */
export const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: Identity<A>) => B = (b, f) => (fa) => f(fa, b)

/**
 * @category traversing
 * @since 2.6.3
 */
export const traverse: PipeableTraverse1<URI> =
  <F>(F: ApplicativeHKT<F>): (<A, B>(f: (a: A) => HKT<F, B>) => (ta: Identity<A>) => HKT<F, Identity<B>>) =>
  (f) =>
  (ta) =>
    F.map(f(ta), id)

/**
 * @category traversing
 * @since 2.6.3
 */
export const sequence: Traversable1<URI>['sequence'] =
  <F>(F: ApplicativeHKT<F>) =>
  <A>(ta: Identity<HKT<F, A>>): HKT<F, Identity<A>> => {
    return F.map(ta, id)
  }

/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW: <B>(that: () => Identity<B>) => <A>(fa: Identity<A>) => Identity<A | B> = () => id

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.0.0
 */
export const alt: <A>(that: () => Identity<A>) => (fa: Identity<A>) => Identity<A> = altW

/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Identity'

/**
 * @category type lambdas
 * @since 2.0.0
 */
export type URI = typeof URI

declare module './HKT' {
  interface URItoKind<A> {
    readonly [URI]: Identity<A>
  }
}

/**
 * @category instances
 * @since 2.0.0
 */
export const getShow: <A>(S: Show<A>) => Show<Identity<A>> = id

/**
 * @category instances
 * @since 2.0.0
 */
export const getEq: <A>(E: Eq<A>) => Eq<Identity<A>> = id

/**
 * @category instances
 * @since 2.7.0
 */
export const Functor: Functor1<URI> = {
  URI,
  map: _map
}

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
export const Chain: Chain1<URI> = {
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
 * @since 2.16.7
 */
export const tap: {
  <A, _>(self: Identity<A>, f: (a: A) => Identity<_>): Identity<A>
  <A, _>(f: (a: A) => Identity<_>): (self: Identity<A>) => Identity<A>
} = /*#__PURE__*/ dual(2, tap_(Chain))

/**
 * Alias of `tap`
 *
 * @category legacy
 * @since 2.0.0
 */
export const chainFirst: <A, B>(f: (a: A) => B) => (first: A) => A = tap

/**
 * @category instances
 * @since 2.7.0
 */
export const Foldable: Foldable1<URI> = {
  URI,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Traversable: Traversable1<URI> = {
  URI,
  map: _map,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Alt: Alt1<URI> = {
  URI,
  map: _map,
  alt: _alt
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Comonad: Comonad1<URI> = {
  URI,
  map: _map,
  extend: _extend,
  extract
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

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @category do notation
 * @since 2.9.0
 */
export const Do: Identity<{}> = /*#__PURE__*/ of(_.emptyRecord)

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
export const bind = /*#__PURE__*/ bind_(Chain)

/**
 * @category do notation
 * @since 2.8.0
 */
export const apS = /*#__PURE__*/ apS_(Apply)

// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------

/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chain: <A, B>(f: (a: A) => Identity<B>) => (ma: Identity<A>) => Identity<B> = flatMap

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `I.Functor` instead of `I.identity`
 * (where `I` is from `import I from 'fp-ts/Identity'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const identity: Monad1<URI> & Foldable1<URI> & Traversable1<URI> & Alt1<URI> & Comonad1<URI> & ChainRec1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: flatMap,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence,
  alt: _alt,
  extract,
  extend: _extend,
  chainRec: _chainRec
}
