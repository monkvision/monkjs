import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

const xml = (color) => `
  <svg width="502" height="380" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M341.785 256.118c53.456 6.33 167.412 17.092 195.583 9.495 6.902-1.055 21.629-3.165 25.321-3.165m-211.143-41.28 184.373 16.354h26.772M317.257 116.321l188.989 17.804c1.934.484 6.225 3.218 7.913 10.287l13.188 66.206-10.419 11.474-164.063-14.639M276.373 86.912c9.407 1.758 30.676 6.33 40.488 10.55l126.212 6.463M281.384 88.89l65.546 24.926c3.913 1.363 13.558 4.088 20.838 4.088M56.127 301.75 38.587 376M15.903 184.769 1 209.958l3.165 31.125 51.83 60.798 77.943 2.901" stroke="${color}" stroke-width="3.191"/>
    <path d="M135.126 93.373H77.229c.308 4.045-3.904 14.217-23.212 22.552l-20.442 11.211-13.056 15.826-7.913 33.894 3.165 7.913h12.661" stroke="${color}" stroke-width="3.191"/>
    <path d="M168.362 83.615c-11.386 2.461-37.429 9.522-50.512 18.068l-54.468 15.298m22.024 82.163-46.95 1.451H33.84l-8.705-6.99 19.783-52.226c.791-2.066 3.956-6.647 10.287-8.441l66.469-17.144m36.928 17.541c1.539-1.099 5.935-3.403 11.21-3.825 38.334.22 115.424 2.031 117.113 7.517" stroke="${color}" stroke-width="3.191"/>
    <path d="m141.323 139.401 1.451-8.836c4.264-2.99 14.745-9.153 22.552-9.891 37.367.219 113.736 1.793 120.278 6.33m-11.871 60.666c13.232 1.407 40.198 4.827 42.203 7.254 3.912 3.649 11.869 11.948 12.397 15.958m-84.8 99.439 20.178-49.588 14.639-22.024 43.522-10.947 5.935-7.517m-125.685 46.291 5.539 25.454h24.53l4.353-24.662m-127.4-58.029c1.451 3.121 5.513 9.654 10.155 10.814l41.28 13.189 15.298 24.134 15.562 52.358m-82.295-106.298c3.781-4.836 12.344-14.771 16.354-15.826 11.386-1.275 35.977-3.588 43.257-2.638" stroke="${color}" stroke-width="3.191"/>
    <path d="M351.268 204.815c0 71.856-59.309 130.155-132.53 130.155s-132.53-58.299-132.53-130.155c0-71.857 59.309-130.156 132.53-130.156s132.53 58.299 132.53 130.156Z" stroke="${color}" stroke-width="3.191"/>
    <path d="M328.058 204.962c0 59.264-48.917 107.355-109.318 107.355-60.402 0-109.319-48.091-109.319-107.355S158.338 97.607 218.74 97.607c60.401 0 109.318 48.091 109.318 107.355Z" stroke="${color}" stroke-width="3.191"/>
    <path d="M170.47 182.922c-7.597 7.386-10.375 28.048-10.815 37.455 8.441 19.097 35.521 41.456 48.006 50.248h23.871c12.344-7.069 35.564-31.256 45.631-42.467 5.065-7.28-.175-29.937-3.429-40.356-6.963-6.752-23.563-15.21-30.992-18.595h-38.246c-12.978.316-28.092 9.275-34.026 13.715Z" stroke="${color}" stroke-width="3.191"/>
    <circle cx="220.454" cy="201.782" r="20.033" stroke="${color}" stroke-width="3.191"/>
    <path d="M160.84 171.185a22.319 22.319 0 0 1-4.483-13.452c0-12.383 10.038-22.421 22.421-22.421 12.382 0 22.42 10.038 22.42 22.421 0 4.583-1.376 8.846-3.737 12.397m87.307 3.956a22.313 22.313 0 0 0 3.736-12.397c0-12.382-10.037-22.42-22.42-22.42-12.382 0-22.42 10.038-22.42 22.42 0 3.138.645 6.125 1.809 8.836" stroke="${color}" stroke-width="3.191"/>
    <circle cx="165.193" cy="165.25" r="1.714" fill="${color}"/>
    <circle cx="163.348" cy="157.337" r="1.714" fill="${color}"/>
    <circle cx="165.985" cy="149.688" r="1.714" fill="${color}"/>
    <circle cx="171.523" cy="144.412" r="1.714" fill="${color}"/>
    <circle cx="179.437" cy="142.566" r="1.714" fill="${color}"/>
    <circle cx="187.088" cy="145.203" r="1.714" fill="${color}"/>
    <circle cx="192.361" cy="151.006" r="1.714" fill="${color}"/>
    <circle cx="194.209" cy="158.128" r="1.714" fill="${color}"/>
    <circle cx="191.569" cy="166.569" r="1.714" fill="${color}"/>
    <rect x="251.845" y="167.963" width="3.957" height=".992" rx=".496" transform="rotate(-28.594 251.845 167.963)" fill="${color}"/>
    <rect x="249.994" y="161.632" width="3.957" height=".992" rx=".496" transform="rotate(-.387 249.994 161.632)" fill="${color}"/>
    <rect x="251.281" y="154.919" width="3.957" height=".992" rx=".496" transform="rotate(26.294 251.281 154.919)" fill="${color}"/>
    <rect x="255.102" y="149.02" width="3.957" height=".992" rx=".496" transform="rotate(42.35 255.102 149.02)" fill="${color}"/>
    <rect x="260.964" y="145.146" width="3.957" height=".992" rx=".496" transform="rotate(75.326 260.964 145.146)" fill="${color}"/>
    <rect x="267.699" y="144.051" width="3.957" height=".992" rx=".496" transform="rotate(91.915 267.699 144.051)" fill="${color}"/>
    <rect x="274.771" y="146.397" width="3.957" height=".992" rx=".496" transform="rotate(121.981 274.771 146.397)" fill="${color}"/>
    <rect x="279.365" y="150.738" width="3.957" height=".992" rx=".496" transform="rotate(139.174 279.365 150.738)" fill="${color}"/>
    <rect x="282.191" y="156.932" width="3.957" height=".992" rx=".496" transform="rotate(177.487 282.191 156.932)" fill="${color}"/>
    <rect x="282.107" y="163.518" width="3.957" height=".992" rx=".496" transform="rotate(-168.257 282.107 163.518)" fill="${color}"/>
    <rect x="280.387" y="169.192" width="3.957" height=".992" rx=".496" transform="rotate(-153.247 280.387 169.192)" fill="${color}"/>
    <path d="m58.502 0 15.43 90.208c.396 1.275 1.61 3.72 3.297 3.297m199.805 147.841c10.462 3.341 33.34 10.076 41.147 10.287" stroke="${color}" stroke-width="3.191"/>
    <rect x="364.158" y="128.678" width="131.938" height="71.902" rx="4.735" transform="rotate(5.282 364.158 128.678)" stroke="${color}" stroke-width="3.191"/>
  </svg>
`;

export default function AbstractDashboard({ color, ...props }) { return (<SvgXml xml={xml(color)} height="100%" {...props} />); }

AbstractDashboard.propTypes = {
  color: PropTypes.string,
};
AbstractDashboard.defaultProps = {
  color: '#fff',
};
