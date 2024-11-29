import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Page, VideoCapturePage } from '../pages';
import { App } from './App';

// export function AppRouter() {
//   return (
//     <MemoryRouter>
//       <Routes>
//         <Route path='/' element={<App />}>
//           <Route path='/' element={<Navigate to={Page.VIDEO_CAPTURE} />} />
//           <Route path={Page.VIDEO_CAPTURE} element={<VideoCapturePage />} />
//            <Route path='/' element={<Navigate to={Page.CREATE_INSPECTION} />} />
//            <Route path={Page.LOG_IN} element={<LoginPage />} />
//            <Route
//             path={Page.CREATE_INSPECTION}
//             element={
//               <AuthGuard redirectTo={Page.LOG_IN}>
//                 <CreateInspectionPage />
//               </AuthGuard>
//             }
//             index
//            />
//            <Route
//             path={Page.VIDEO_CAPTURE}
//             element={
//               <AuthGuard redirectTo={Page.LOG_IN}>
//                 <VideoCapturePage />
//               </AuthGuard>
//             }
//             index
//            />
//            <Route path='*' element={<Navigate to={Page.CREATE_INSPECTION} />} />
//           <Route path='*' element={<Navigate to={Page.VIDEO_CAPTURE} />} />
//         </Route>
//       </Routes>
//     </MemoryRouter>
//   );
// }

export function AppRouter() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Navigate to={Page.VIDEO_CAPTURE} />} />
          <Route path={Page.VIDEO_CAPTURE} element={<VideoCapturePage />} />
          <Route path='*' element={<Navigate to={Page.VIDEO_CAPTURE} />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
