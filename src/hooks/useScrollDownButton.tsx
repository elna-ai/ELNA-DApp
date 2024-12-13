import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';

export function UseScrollToBottom() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {

        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
            const distanceBeforeAppear = Math.round(windowHeight/3);

            setShowButton(distanceFromBottom > distanceBeforeAppear);
        }

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'auto',
        });
    };

    return (
        <Button
            onClick={scrollToBottom}
            className={classNames('',{ 'd-none': !showButton })}
            style={{
                position: 'fixed',
                bottom: '150px',
                right: '20px',
                width: "fit-content",
            }}
        >
            <i className="ri-arrow-down-line"></i>
        </Button>
    )
}