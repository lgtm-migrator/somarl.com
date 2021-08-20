import {GetStaticPaths, InferGetStaticPropsType, GetStaticProps} from 'next'
import {MDXRemote} from 'next-mdx-remote'

import {postComponents, PostLayout, PostTime, PostTitle} from '../../components/post'
import useInteractiveToc from '../../libs/useInteractiveToc'

import type {ParsedUrlQuery} from 'querystring'
import {postFileSlugsSync, serializePost, searchMDXComponentInSource} from '../../libs/mdx'
import dynamic from 'next/dynamic'


const DYNAMIC_COMPONENT_NAMES = ['NextJS', 'MDXIcon']
const dynamicComponents = {
    NextJS: dynamic(() => import(`../../components/icons/NextJS`)),
    MDXIcon: dynamic(() => import(`../../components/icons/MDXIcon`)),
}

interface IProps {
    slug: string
    compiledSource: string
    scope: IPostMeta
    extraComponents: Record<string, boolean>
}

interface IStaticProps extends ParsedUrlQuery {
    slug: string
}

export default function PostPage ({slug, compiledSource, scope, extraComponents}: InferGetStaticPropsType<typeof getStaticProps>) {
    const components = Object.assign({}, postComponents, Object.fromEntries(DYNAMIC_COMPONENT_NAMES
        .filter(name => extraComponents[name])
        .map(name => [name, dynamicComponents[name]]))
    )

    useInteractiveToc()

    return (
        <PostLayout slug={slug} title={scope.title} description={scope.abstract}>
            <article>
                <PostTitle post={scope} />
                <MDXRemote compiledSource={compiledSource} scope={scope} components={components} />
                <PostTime post={scope} />
            </article>
        </PostLayout>
    )
}

export const getStaticProps: GetStaticProps<IProps, IStaticProps> = async ({params: {slug} = {slug: ''}}) => {
    const {compiledSource, scope} = await serializePost(slug)
    const extraComponents = searchMDXComponentInSource(compiledSource, DYNAMIC_COMPONENT_NAMES)

    return {
        props: {
            slug,
            compiledSource,
            scope,
            extraComponents,
        },
    }
}

export const getStaticPaths: GetStaticPaths<IStaticProps> = async ctx => {
    return {
        paths: postFileSlugsSync().map(slug => ({
            params: {
                slug,
            },
        })),
        fallback: false,
    }
}
