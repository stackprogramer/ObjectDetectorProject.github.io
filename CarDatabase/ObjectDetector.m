detector = vision.CascadeObjectDetector('CarModel.xml');
img = imread('queryimage\1 (5).jpg');
bbox = step(detector,img);
detectedImg = insertObjectAnnotation(img,'rectangle',bbox,'Car Detection');
figure;
imshow(detectedImg);