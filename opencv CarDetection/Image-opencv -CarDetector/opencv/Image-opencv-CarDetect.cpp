/**
 Image CarDetect By R.Borumandi  Shiraz University
 */
#include "opencv2/objdetect/objdetect.hpp"
#include "opencv2/highgui/highgui.hpp"						  face_cascade_name 
#include "opencv2/imgproc/imgproc.hpp"

#include <iostream>
#include <stdio.h>

using namespace std;
using namespace cv;

/** Function Headers */
void detectAndDisplay( Mat frame );

/** Global variables */
//-- Note, either copy these two files from opencv/data/haarscascades to your current folder, or change these locations
String car_cascade_name = "CarModel.xml";


CascadeClassifier car_cascade;

string window_name = "Capture - car detection";
RNG rng(12345);

/**
 * @function main
 */
int main( void )
{
  
  Mat frame;
  string imageName("image.jpg"); 

  frame= imread(imageName.c_str(), IMREAD_COLOR);

  //-- 1. Load the cascades
  if( !car_cascade.load( car_cascade_name ) ){ printf("--(!)Error loading\n"); return -1; };
 
  
      //-- 3. Apply the classifier to the frame
      
       detectAndDisplay( frame ); 
      

     

   waitKey(0);
  
  return 0;
}

/**
 * @function detectAndDisplay
 */
void detectAndDisplay( Mat frame )
{
   std::vector<Rect> faces;
   Mat frame_gray;

   cvtColor( frame, frame_gray, COLOR_BGR2GRAY );
   equalizeHist( frame_gray, frame_gray );
   //-- Detect car
   car_cascade.detectMultiScale( frame_gray, faces, 1.1, 2, 0|CV_HAAR_SCALE_IMAGE, Size(30, 30) );

   for( size_t i = 0; i < faces.size(); i++ )
    {
      Point center( faces[i].x + faces[i].width/2, faces[i].y + faces[i].height/2 );
      ellipse( frame, center, Size( faces[i].width/2, faces[i].height/2), 0, 0, 360, Scalar( 255, 0, 255 ), 2, 8, 0 );
	 

      Mat faceROI = frame_gray( faces[i] );
      std::vector<Rect> eyes;

     
    }
   //-- Show what you got
   imshow( window_name, frame );
}
