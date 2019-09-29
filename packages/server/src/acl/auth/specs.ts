import { User } from '../../graphql/user/models'


export interface IAuthService {
  validate (username: S, token: S): P<User|void>
  signUp (user: User): P<{user: User, token: S}>
  login (user: User): P<{user: User, token: S}>
  logout (user: User): P<void>
}

export interface IStrategy {
  validate (...args: L<A>): P<User>
}
