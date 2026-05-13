import { useEffect } from 'react';
const SITE_NAME = 'Mates Aconcagua';
export function usePageSEO({ title, description }) {
    useEffect(() => {
        const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
        document.title = fullTitle;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        if (description)
            metaDesc.content = description;
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.content = fullTitle;
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (!ogDesc) {
            ogDesc = document.createElement('meta');
            ogDesc.setAttribute('property', 'og:description');
            document.head.appendChild(ogDesc);
        }
        if (description)
            ogDesc.content = description;
        return () => {
            document.title = SITE_NAME;
        };
    }, [title, description]);
}
