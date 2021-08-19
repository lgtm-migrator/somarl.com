import {useEffect} from 'react'


export default function useInuseInteractiveToc () {
    useEffect(() => {
        const $tocTreeContainer = document.querySelector<HTMLUListElement>('#toc + ul')?.parentElement
        if (!$tocTreeContainer) return

        $tocTreeContainer.style.opacity = '1'
        const firstSection = $tocTreeContainer.nextSibling as HTMLElement
        firstSection.style.marginTop = `calc(1em - ${$tocTreeContainer.clientHeight}px)`
    }, [])

    useEffect(() => {
        const elementsToObserve = document.querySelectorAll('article > section > [id]')
        const visibleClass = 'visible'
        const $toc = document.getElementById('toc')
        const $tocTree = document.querySelector('#toc + ul')
        if (!$toc || !$tocTree) return
        const $svg = document.getElementById('tocmark')
        const $svgPath = $svg?.querySelector<SVGPathElement>('path')
        if (!$svg || !$svgPath) return

        $toc.parentNode?.parentNode?.insertBefore($toc, $toc.parentNode)
        $tocTree.parentNode?.insertBefore($svg, $tocTree)

        const navItems = [...$tocTree.querySelectorAll('li')].map($li => {
            const $anchor = $li.querySelector('a')!
            const targetID = ($anchor.getAttribute('href') || '#').slice(1)
            const target = document.getElementById(targetID)

            return {listItem: $li, $anchor, target, pathStart: Infinity, pathEnd: -Infinity}
        }).filter(item => item.target)

        function drawPath () {
            if (!$svgPath) return

            const path: Array<string | number> = []
            let pathIndent: number
            navItems.forEach((item, i) => {
                const x = item.$anchor.offsetLeft - 5
                const y = item.$anchor.offsetTop
                const height = item.$anchor.offsetHeight

                if (i === 0) {
                    path.push('M', x, y, 'L', x, y + height)
                    item.pathStart = 0
                } else {
                    if (pathIndent !== x) path.push('L', pathIndent, y)

                    path.push('L', x, y)
                    $svgPath.setAttribute('d', path.join(' '))
                    item.pathStart = $svgPath.getTotalLength() || 0
                    path.push('L', x, y + height)
                }

                pathIndent = x
                $svgPath.setAttribute('d', path.join(' '))
                item.pathEnd = $svgPath.getTotalLength()
            })
        }

        function syncPath () {
            if (!$tocTree || !$svgPath) return

            const someElsAreVisible = () => $tocTree.querySelectorAll(`.${visibleClass}`).length > 0
            const thisElIsVisible = ($li: HTMLLIElement) => $li.classList.contains(visibleClass)
            const pathLength = $svgPath.getTotalLength()

            let pathStart = pathLength
            let pathEnd = 0
            let lastPathStart
            let lastPathEnd

            navItems.forEach(item => {
                if (thisElIsVisible(item.listItem)) {
                    pathStart = Math.min(item.pathStart, pathStart)
                    pathEnd = Math.max(item.pathEnd, pathEnd)
                }
            })

            if (someElsAreVisible() && pathStart < pathEnd) {
                if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
                    const dashArray = `1 ${pathStart} ${pathEnd - pathStart} ${pathLength}`

                    $svgPath.style.setProperty('stroke-dashoffset', '1')
                    $svgPath.style.setProperty('stroke-dasharray', dashArray)
                    $svgPath.style.setProperty('opacity', '1')
                }
            } else {
                $svgPath.style.setProperty('opacity', '0')
            }

            lastPathStart = pathStart
            lastPathEnd = pathEnd
        }

        drawPath()

        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            const id = entry.target.querySelector('[id]')?.getAttribute('id')
            const $anchor = document.querySelector(`li a[href="#${id}"]`)

            if (!$anchor?.parentElement?.parentElement) return

            const listItem = $anchor.parentElement.parentElement

            if (entry.isIntersecting) {
                listItem.classList.add(visibleClass)
            } else {
                listItem.classList.remove(visibleClass)
            }

            syncPath()
        }), {
            rootMargin: '-100px',
        })

        elementsToObserve.forEach(el => observer.observe(el.parentElement || el))

        return () => observer.disconnect()
    }, [])
}
