// tslint:disable: no-magic-numbers

import { IsOptional, MaxLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { JSONScalarType } from '../../shared'


@InputType()
export class NewRecipeInput {
  @Field()
  @MaxLength(30)
  public title!: S

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  public description?: S

  @Field(type => JSONScalarType, { nullable: true })
  public meta?: {
    testField: N
  }

  @Field(type => [String])
  public ingredients!: L<S>
}
