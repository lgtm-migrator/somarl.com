import {GetStaticPaths, InferGetStaticPropsType, GetStaticProps} from 'next'
import Head from '../../components/Head'
import Footer from '../../components/Footer'
import PostList from '../../components/PostList'
import Book from '../../components/icons/Book'

import type {ParsedUrlQuery} from 'querystring'
import {getCollectionMap} from '../../libs/mdx'


interface IProps {
    collection: string
    posts: IPostMeta[]
}

interface IStaticProps extends ParsedUrlQuery {
    collection: string
}

export default function Collection ({posts, collection}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <Head title={`${collection} | Yang`} description="I'm a Web developer based in Shanghai." />
            <article>
                <h1><Book />{collection}</h1>
                <p>{posts.length} {posts.length > 1 ? 'posts' : 'post'} in collection <cite>{collection}</cite></p>
                <PostList posts={posts} />
            </article>
            <Footer />
        </>
    )
}

export const getStaticProps: GetStaticProps<IProps, IStaticProps> = async ({params: {collection} = {collection: ''}}) => {
    const collectionMap = await getCollectionMap()
    const posts = collectionMap[collection]

    return {
        props: {
            collection,
            posts,
        },
    }
}

export const getStaticPaths: GetStaticPaths<IStaticProps> = async ctx => {
    const collectionMap = await getCollectionMap()
    return {
        paths: Object.keys(collectionMap).map(collection => ({
            params: {
                collection,
            },
        })),
        fallback: false,
    }
}
